'use client';

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";

export default function Menu() {
    const pathname = usePathname();

    const showMenu = pathname.startsWith('/dashboard');

    const handleLogout = () => {
        signOut({ callbackUrl: '/login', redirect: true });
    };

    if (!showMenu) return null;

    return (
        <nav className="w-full bg-background border-b h-10">
            <ul className="flex gap-4 text-sm items-center h-full py-1 px-10 container mx-auto">
                <li><Link href={`/dashboard`} className="py-1.5 px-3 rounded hover:bg-gray-100 transition ease-in-out duration-300">Painel</Link></li>
                <li><Link href={`/dashboard/posts`} className="py-1.5 px-3 rounded hover:bg-gray-100 transition ease-in-out duration-300">Postagens</Link></li>
                <button onClick={handleLogout} className="absolute end-10 flex items-center gap-1.5 cursor-pointer font-medium">
                    <FaSignOutAlt />
                    Sair
                </button>
            </ul>
        </nav>
    );
}