import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from "next/server";
import AuthService from "./services/AuthService";

export async function proxy(request: NextRequest) {
  console.log(`[PROXY] - ${request.url}`);
  const cookieStore = await cookies();

  if (request.nextUrl.pathname.startsWith("/auth/verify-account")) {
    cookieStore.delete("token");
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/auth/signin") && cookieStore.has("token")) {
    return NextResponse.redirect(new URL("/panel", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/auth/signup")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/auth/forgot-password")) {
    return NextResponse.next();
  }

  if (cookieStore.has("token")) {
    try {
      const response = await AuthService.verifyToken(cookieStore.get("token")?.value as string);

      if (!response.data.verified) {
        return NextResponse.redirect(new URL(`/auth/verify-account?email=${response.data.email}`, request.url));
      }

      if (request.nextUrl.pathname.startsWith("/auth/signin")) {
        return NextResponse.redirect(new URL("/panel", request.url));
      }
    } catch (error: any) {
      console.log(`[PROXY] - Token error ${error.message}`);
      if (error.data?.needVerifyFlow == true) {
        return NextResponse.redirect(new URL(`/auth/verify-account?authFlowId=${error.data.authFlowId}`, request.url));
      }
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