import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import AuthService from '@/services/AuthService';

export async function GET() {
  try {
    const cookieStore = await cookies();

    if (cookieStore.has("token")) {
      const token = (cookieStore.get("token")?.value) as string;

      const response = await AuthService.me(token);

      return NextResponse.json({
        user: response.data,
        token: token
      }, {
        status: response.status
      });
    }

    return NextResponse.json({
      message: "Unauthorized"
    }, {
      status: 401
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error.message
    }, {
      status: 401
    });
  }
}