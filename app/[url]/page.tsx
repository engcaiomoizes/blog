'use client';

import { Post } from "@/types/post";
import { useEffect, useState } from "react";

export default function PostPage({ params }: any) {
    const [data, setData] = useState<Post>();
    const [loading, setLoading] = useState(false);

    const handleLoad = async () => {
        try {
            setLoading(true);

            const response = await fetch(`/api/posts/${params.url}`);

            if (response.ok) {
                const data = await response.json();
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

    return (
        <div className="container mx-auto p-10">
            <span>{params.url}</span>
        </div>
    );
}