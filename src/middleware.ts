import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from "next/server";
import AuthService from "./services/AuthService";

export async function middleware(request: NextRequest) {
  console.log(`[MIDDLEWARE] - ${request.url}`);

  if (request.nextUrl.pathname.startsWith("/auth/verify-account")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/auth/signin")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/auth/signup")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/auth/forgot-password")) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  if (cookieStore.has("token")) {
    try {
      const { data } = await AuthService.verifyToken(cookieStore.get("token")?.value as string);

      if (!data.verified) {
        return NextResponse.redirect(new URL(`/auth/verify-account?email=${data.email}&redirect=/panel`, request.url));
      }

      if (request.nextUrl.pathname.startsWith("/auth/signin")) {
        return NextResponse.redirect(new URL("/panel", request.url));
      }
    } catch (error: any) {
      cookieStore.delete("token");
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  } else if (request.nextUrl.pathname.startsWith("/panel")) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
}

export const config = {
  matcher: ["/panel/:path*", "/auth/:path*"],
}