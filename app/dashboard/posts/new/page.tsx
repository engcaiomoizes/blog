import PostForm from "@/components/forms/postForm";

export default function NewPost() {
    return (
        <div className="flex flex-col gap-4 container mx-auto p-10">
            <h1>Nova Postagem</h1>
            <PostForm />
        </div>
    );
}