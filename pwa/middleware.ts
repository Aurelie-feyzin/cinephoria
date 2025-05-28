import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {getProfileInMiddelware} from "./request/user";

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const token = request.cookies.get('jwt_token')?.value;

    if (!token) {
        url.pathname = "/signIn";
        return NextResponse.redirect(url);
    }

    try {
        const user = await getProfileInMiddelware(token).then();
        const role = user.role || null;

        const pathname = request.nextUrl.pathname;

        if (pathname.startsWith("/admin") && role != "admin") {
            url.pathname = "/forbidden";

            return NextResponse.redirect(url);
        }

        if (pathname.startsWith("/intranet") && !role) {
            url.pathname = "/forbidden";

            return NextResponse.redirect(url);
        }

        return NextResponse.next();

    } catch (error) {
        console.error("Erreur middleware auth:", error);
        url.pathname = "/forbidden";

        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: ["/admin/:path*", "/intranet/:path*"],
};
