'use client';

import { SubmitHandler, useForm } from "react-hook-form";
import RichTextEditor from "../editor/RichTextEditor";

type Inputs = {
    title: string;
    subtitle: string;
}

export default function PostForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        //
    };

    const handleUpdate = () => {
        //
    };

    return (
        <div className="flex flex-col gap-2 p-3 bg-white rounded shadow w-full">
            <div className="flex flex-col">
                <label htmlFor="title" className="text-sm">Título:</label>
                <input type="text" { ...register("title", { required: true }) } className="border border-gray-300 rounded outline-none py-1.5 px-3" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="subtitle" className="text-sm">Subtítulo:</label>
                <input type="text" { ...register("subtitle", { required: true }) } className="border border-gray-300 rounded outline-none py-1.5 px-3" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="content" className="text-sm">Conteúdo:</label>
                <RichTextEditor onUpdate={handleUpdate} initialContent="" />
            </div>
        </div>
    );
}