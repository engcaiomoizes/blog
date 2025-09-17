'use client';

import { SubmitHandler, useForm } from "react-hook-form";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";

type Inputs = {
    author: string;
    title: string;
    subtitle: string;
    content: any;
    thumbnail: string;
}

export default function PostForm() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await fetch('/api/posts', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("Sucesso!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = (content: any) => {
        setValue('content', content);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 p-3 bg-white rounded shadow w-full">
            <div className="flex flex-col">
                <label htmlFor="title" className="text-sm">Título:</label>
                <input type="text" { ...register("title", { required: true }) } className="border border-gray-300 rounded outline-none py-1.5 px-3" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="subtitle" className="text-sm">Subtítulo:</label>
                <input type="text" { ...register("subtitle", { required: false }) } className="border border-gray-300 rounded outline-none py-1.5 px-3" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="content" className="text-sm">Conteúdo:</label>
                <SimpleEditor onUpdate={handleUpdate} />
            </div>
            <div className="flex items-center justify-end">
                <input type="submit" value="Postar" className="cursor-pointer border py-1.5 px-6 rounded bg-teal-500 border-teal-500 text-white font-medium hover:bg-teal-600 hover:border-teal-600 transition ease-in-out duration-200" />
            </div>
        </form>
    );
}