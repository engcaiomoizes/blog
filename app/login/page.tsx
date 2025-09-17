'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

type Inputs = {
    email: string;
    password: string;
}

export default function Login() {
    const [message, setMessage] = useState("");

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            console.log("[LOGIN_RESPONSE]: ", response);

            if (!response?.error) {
                router.refresh();
                router.push("/dashboard");
            } else {
                console.log("[LOGIN_ERROR]: Senha incorreta!");
                setMessage("E-mail e/ou senha incorreta!");
            }
        } catch (err) {
            console.error(err);
        } finally {
            //
        }
    };

    useEffect(() => {
        const storedMessage = sessionStorage.getItem("message");
        if (storedMessage) {
            setMessage(storedMessage);
            sessionStorage.removeItem("message");
        }
    }, []);

    return (
        <div className="flex h-screen justify-center items-center">
            <form className="flex flex-col items-center p-6 gap-4 rounded bg-white shadow w-84" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="font-bold text-lg text-gray-800">Fazer Login</h1>
                <div className="flex flex-col w-full">
                    <label htmlFor="email" className="text-sm">E-mail:</label>
                    <input type="email" { ...register("email", { required: true }) } autoComplete="off" className="text-teal-600 border-b-2 border-gray-300 outline-none focus:border-teal-500 transition ease-in-out duration-200" />
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="email" className="text-sm">Senha:</label>
                    <input type="password" { ...register("password", { required: true }) } className="text-teal-800 border-b-2 border-gray-300 outline-none focus:border-teal-500 transition ease-in-out duration-200" />
                </div>
                <input type="submit" value="Entrar" className="cursor-pointer w-full border p-1.5 rounded text-sm border-orange-500 bg-orange-500 text-white font-bold hover:bg-orange-600 hover:border-orange-600 transition ease-in-out duration-200" />
            </form>
        </div>
    );
}