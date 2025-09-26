import PostForm from "@/components/forms/postForm";

type Params = Promise<{ id: string }>;

export default async function EditPost({ params }: { params: Params }) {
    const { id } = await params;

    return (
        <div className="flex flex-col gap-4 container mx-auto p-10">
            <PostForm id={id} />
        </div>
    );
}