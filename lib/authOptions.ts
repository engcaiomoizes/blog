import { NextAuthOptions, User } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

interface Credentials {
    email?: string;
    password?: string;
}

// Aumentar o tipo Session para incluir suas propriedades personalizadas
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
        }
        expires: string;
    }

    interface User {
        id: string;
        name: string;
        email: string;
    }
}

// Aumentar o tipo JWT para incluir suas propriedades personalizadas
declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name: string;
        email: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'E-mail', type: 'email' },
                password: { label: 'Senha', type: 'password' }
            },
            async authorize(credentials?: Credentials) {
                if (!credentials) {
                    console.log("Credentials are undefined.");
                    return null;
                }

                const { email, password } = credentials;

                if (!email || !password) {
                    console.log("E-mail ou senha ausentes.");
                    return null;
                }

                try {
                    const client = await clientPromise;
                    const db = client.db("blog");
                    const users = db.collection("users");

                    const userFromDb = await users.findOne({ email: email });

                    if (!userFromDb?.password) {
                        console.log("Senha do usuário não encontrada.");
                        return null;
                    }

                    const isValidPassword = await bcrypt.compare(password, userFromDb.password);

                    if (!isValidPassword) {
                        console.log("Senha inválida.");
                        return null;
                    }

                    // Construir o objeto de usuário
                    const userForSession: User = {
                        id: userFromDb._id.toString(),
                        name: userFromDb.name,
                        email: userFromDb.email,
                    };

                    return userForSession;

                } catch (error) {
                    console.error("Erro durante a autenticação:", error);
                    return null;
                }
            },
        })
    ],
    callbacks: {
        jwt: async ({ token, user, trigger, session }) => {
            if (user) {
                const customUser = user as any;

                return {
                    ...token,
                    id: customUser.id,
                    name: customUser.name,
                    email: customUser.email,
                };
            }

            if (trigger === 'update') {
                try {
                    const client = await clientPromise;
                    const db = client.db("blog");
                    const users = db.collection("users");

                    const userFromDb = await users.findOne({
                        _id: new ObjectId(token.id),
                    });

                    if (userFromDb) {
                        // Atualize o token com os dados mais recentes
                        token.name = userFromDb.name;
                        token.email = userFromDb.email;
                    }
                } catch (err) {
                    console.error('Erro ao atualizar o token: ', err);
                }
            }

            return token;
        },
        session: async ({ session, token }) => {
            session.user.id = token.id as string;
            session.user.name = token.name as string;
            session.user.email = token.email as string;

            return session;
        }
    },
    pages: {
        signIn: '/login'
    }
}