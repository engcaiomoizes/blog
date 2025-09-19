import Menu from "@/components/dashboard/menu";
import { AuthProvider } from "@/providers/auth-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Caio Moizés Santos",
  description: "Blog de Caio Moizés Santos",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <div>
                <Menu />
                {children}
            </div>
        </AuthProvider>
    );
}