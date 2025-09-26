'use client';

import { Post } from "@/types/post";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FaTrash, FaEdit } from "react-icons/fa";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Alert from "@/components/alert/alert";

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [variant, setVariant] = useState<'default' | 'success' | 'error' | 'warning' | 'info'>('default');

    const handleLoad = async () => {
        try {
            setLoading(true);

            const response = await fetch('/api/posts');

            if (response.ok) {
                const data = await response.json();

                setPosts(data.response);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            await handleLoad();
        };

        load();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch('/api/posts', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message);
                setVariant('success');
                await handleLoad();
                window.scrollTo(0,0);
            } else {
                setMessage("Ocorreu um erro ao deletar a postagem.");
                setVariant('error');
            }
        } catch (err) {
            console.error(err);
            setMessage("Ocorreu um erro inesperado.");
            setVariant('error');
        }
    };

    if (loading) return null;

    return (
        <div className="flex flex-col gap-4 container mx-auto p-10">
            <div className="flex items-center justify-end gap-10">
                {
                    message &&
                    <Alert variant={variant}>{message}</Alert>
                }
                <Link href={`/dashboard/posts/new`} className="border rounded px-4 py-2 text-sm font-medium bg-teal-500 border-teal-500 text-white cursor-pointer hover:bg-teal-600 hover:border-teal-600 transition ease-in-out duration-200">Nova Postagem</Link>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Título</th>
                        <th scope="col" className="px-6 py-3">Autor</th>
                        <th scope="col" className="px-6 py-3">Data</th>
                        <th scope="col" className="px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        posts.length > 0 ?
                        posts.map((post, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                <td className="px-6 py-4">{post.title}</td>
                                <td className="px-6 py-4">{post.author.name}</td>
                                <td className="px-6 py-4">{format(post.createdAt, "dd/MM/yyyy")}</td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <button className="cursor-pointer flex items-center"><FaEdit /></button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button className="flex items-center cursor-pointer"><FaTrash /></button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Deseja realmente deletar a postagem?</AlertDialogTitle>
                                                <AlertDialogDescription>Esta ação não pode ser desfeita. Ao fazer isto, você perderá todas as informações e comentários desta postagem.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                                                <AlertDialogAction className="cursor-pointer" onClick={() => handleDelete(post._id)}>Confirmar</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </td>
                            </tr>
                        ))
                        :
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                            <td colSpan={4} className="px-6 py-4 text-center">
                                Nenhuma postagem cadastrada.
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}