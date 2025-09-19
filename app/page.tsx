import Posts from "@/components/posts";

export default function Home() {
    return (
        <div className="flex flex-col justify-center items-center container mx-auto p-10">
            <h1>Blog de Caio Moizés Santos</h1>
            <Posts />
        </div>
    );
}