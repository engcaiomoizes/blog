import PostForm from "@/components/forms/postForm";

export default function Home() {
    return (
        <div className="flex flex-col h-screen justify-center items-center container mx-auto px-20">
            <h1 className="text-xl font-bold">Blog de Caio Moizés Santos</h1>
            <PostForm />
        </div>
    );
}