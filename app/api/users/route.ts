import { hashPassword } from "@/lib/bcrypt";
import clientPromise from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const client = await clientPromise;
    const db = client.db("blog");
    const users = await db.collection("users").find().toArray();

    return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json();

        const client = await clientPromise;
        const db = client.db("blog");
        const users = db.collection("users");

        const result = await users.insertOne({
            email,
            password: await hashPassword(password),
            name,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: "Usuário cadastrado com sucesso!", id: result.insertedId });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao cadastrar usuário." }, { status: 500 });
    }
}