'use client';

import { SubmitHandler, useForm } from "react-hook-form";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Inputs = {
    author: string;
    title: string;
    url: string;
    subtitle: string;
    content: any;
    thumbnail: string;
}

export default function PostForm() {
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('author', data.author);
        formData.append('title', data.title);
        formData.append('url', data.url);
        formData.append('subtitle', data.subtitle);
        formData.append('content', data.content);
        formData.append('file', file);

        try {
            const response = await fetch('/api/posts', {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                sessionStorage.setItem("message", "Postagem criada com sucesso!");
                router.push("/dashboard/posts");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = (content: any) => {
        setValue('content', content);
    };

    const handleChangeUrl = (text: string) => {
        const slug = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase().trim().replace(/\//g, "-")
                        .replace(/\s+/g, "-").replace(/[^\w/-]+/g, "")
                        .replace(/\-\-+/g, "-");
        setValue('url', slug);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="flex flex-col gap-2 p-3 bg-white rounded shadow w-full">
            <div className="flex flex-col">
                <label htmlFor="title" className="text-sm">Título:</label>
                <input type="text" { ...register("title", { required: true }) } onChange={(e) => handleChangeUrl(e.target.value)} className="border border-gray-300 rounded outline-none py-1.5 px-3" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="url" className="text-sm">URL:</label>
                <input type="text" { ...register("url", { required: true }) } className="border border-gray-300 rounded outline-none py-1.5 px-3" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="subtitle" className="text-sm">Subtítulo:</label>
                <input type="text" { ...register("subtitle", { required: false }) } className="border border-gray-300 rounded outline-none py-1.5 px-3" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="content" className="text-sm">Conteúdo:</label>
                <SimpleEditor onUpdate={handleUpdate} />
            </div>
            <div className="flex flex-col w-96">
                <label htmlFor="" className="text-sm">Thumbnail:</label>
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                </label>
            </div>
            <div className="flex items-center justify-end">
                <input type="submit" value="Postar" className="cursor-pointer border py-1.5 px-6 rounded bg-teal-500 border-teal-500 text-white font-medium hover:bg-teal-600 hover:border-teal-600 transition ease-in-out duration-200" />
            </div>
        </form>
    );
}