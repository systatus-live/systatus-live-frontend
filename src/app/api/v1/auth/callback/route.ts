import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import AuthService from '@/services/AuthService';

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // TODO Implementar verificação de tipo de login para múltiplos providers (e-mail, google, etc)

    const response = await AuthService.signInEmailPassword(json);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: response.data.access_token,
      httpOnly: true,
      path: "/",
      secure: process.env.ENV === "PROD",
    })

    return NextResponse.json(response.data, {
      status: response.status
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error.message
    }, {
      status: 401
    });
  }
}