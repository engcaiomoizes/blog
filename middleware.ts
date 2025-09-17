import { withAuth, NextRequestWithAuth, NextAuthMiddlewareOptions } from "next-auth/middleware";
import { NextResponse } from "next/server";

const middleware = (req: NextRequestWithAuth) => {
    // const isPrivateRoutes = req.nextUrl.pathname.startsWith('/dashboard');
}

const callbackOptions: NextAuthMiddlewareOptions = {};

export default withAuth(middleware, callbackOptions);

export const config = {
    matcher: [
        '/dashboard/:path*'
    ],
}