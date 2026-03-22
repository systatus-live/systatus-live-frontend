import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import AuthService from '@/services/AuthService';

export async function GET() {
  const cookieStore = await cookies();

  try {
    if (cookieStore.has("token")) {
      const token = (cookieStore.get("token")?.value) as string;

      const response = await AuthService.me(token);

      return NextResponse.json({
        user: response.data,
        token: token
      }, {
        status: 200
      });
    }

    return NextResponse.json({
      message: "Unauthorized"
    }, {
      status: 401
    });
  } catch (error: any) {
    cookieStore.delete("token");

    return NextResponse.json({
      message: error.message
    }, {
      status: 401
    });
  }
}