import Posts from "@/components/posts";

export default function Home() {
    return (
        <div className="flex flex-col justify-center items-center container mx-auto px-20">
            <h1 className="text-xl font-bold">Blog de Caio Moizés Santos</h1>
            <Posts />
        </div>
    );
}