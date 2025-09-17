import Link from "next/link";

export default function Posts() {
    return (
        <div className="flex flex-col gap-4 container mx-auto p-10">
            <div className="flex items-center justify-end">
                <Link href={`/dashboard/posts/new`} className="border rounded px-4 py-2 text-sm font-medium bg-teal-500 border-teal-500 text-white cursor-pointer hover:bg-teal-600 hover:border-teal-600 transition ease-in-out duration-200">Nova Postagem</Link>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Título</th>
                        <th scope="col" className="px-6 py-3">Subtítulo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                        <td className="px-6 py-4">Battlefield 6</td>
                        <td className="px-6 py-4">Teste de descrição</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}