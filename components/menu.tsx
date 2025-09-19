'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Menu() {
    const pathname = usePathname();
    
    const excludeRoutes = pathname.startsWith('/dashboard') || 
        pathname.includes('/login');

    if (excludeRoutes) return null;

    return (
        <nav className="w-full bg-background border-b h-10">
            <ul className="flex gap-4 text-sm items-center h-full py-1 px-10 container mx-auto">
                <li><Link href={`/`} className="py-1.5 px-3 rounded hover:bg-gray-100 transition ease-in-out duration-300">Home</Link></li>
            </ul>
        </nav>
    );
}