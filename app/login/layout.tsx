import { AuthProvider } from "@/providers/auth-provider";

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}