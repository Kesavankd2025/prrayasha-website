import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Without cookies, standard Next.js Middleware cannot access the token (localStorage).
// Client-side protection will be needed in individual pages or a wrapper component.

export function middleware(request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: [] // Disable standard matching for now
};
