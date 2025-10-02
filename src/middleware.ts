import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  try {
    const response = await axios.get(`${process.env.SYSTATUS_API_URL}/v1/auth/verify`, {
      headers: {
        Authorization: `Bearer ${request.cookies.get("token")?.value}`,
      },
    })

    const data = response.data.data;

    if (!data.verified) {
      return NextResponse.redirect(new URL(`/auth/verify-account?email=${data.email}&redirect=/panel`, request.url));
    }
  } catch (error: any) {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return NextResponse.redirect(new URL("/", request.url))
  }
}

export const config = {
  matcher: "/panel/:path*",
}