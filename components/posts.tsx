'use client';

import { useEffect, useState } from "react";

interface Post {
    title: string;
    content: string;
}

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const handleLoad = async () => {
        try {
            const response = await fetch('/api/posts');

            const data = await response.json();

            console.log(data.response);

            setPosts(data.response);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            console.log("entrou");
            await handleLoad();
            console.log(posts);
        };

        load();
    }, []);

    if (loading) return null;

    return (
        <div>
            <h1>Postagens:</h1>
            {
                posts.map((post, index) => (
                    <div key={index}>
                        <span>{post.title}</span>
                    </div>
                ))
            }
        </div>
    );
}