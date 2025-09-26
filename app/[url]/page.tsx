'use client';

import { Post } from "@/types/post";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostPage() {
    const [data, setData] = useState<Post>();
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const params = useParams();

    const handleLoad = async () => {
        try {
            setLoading(true);

            const response = await fetch(`/api/posts/${params.url}`);

            if (response.ok) {
                const data = await response.json();
                if (!data.response) {
                    router.push("/404");
                }
                setData(data.response);
            } else {
                console.log("Ocorreu um erro inesperado.");
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

    if (loading) return null;

    return (
        <div className="container mx-auto p-10">
            <article className="flex flex-col gap-2">
                <h1 className="text-3xl">{data?.title}</h1>
                <span className="text-sm">Por <b>{data?.author.name}</b> - {format(data!.createdAt, "dd/MM/yyyy")}</span>
                <div dangerouslySetInnerHTML={{ __html: data!.content }} className="mt-6"></div>
            </article>
        </div>
    );
}