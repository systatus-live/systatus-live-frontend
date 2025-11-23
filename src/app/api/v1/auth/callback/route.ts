import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import AuthService from '@/services/AuthService';
import { jwtDecode } from 'jwt-decode';

export async function POST(request: Request) {
  try {
    const json = await request.json();

    // TODO Implementar verificação de tipo de login para múltiplos providers (e-mail, google, etc)

    const response = await AuthService.signInEmailPassword(json);
    const accessToken = response.data.access_token;
    const decodedToken = jwtDecode(accessToken);

    const cookieData: any = {
      name: "token",
      value: accessToken,
      httpOnly: true,
      path: "/",
      secure: process.env.ENV === "PROD"
    }

    if (json.keepConected) {
      cookieData["expires"] = new Date(decodedToken.exp! * 1000); // "exp" is in seconds, convert to milliseconds
      cookieData["maxAge"] = decodedToken.exp! - decodedToken.iat!; // maxAge in seconds
    }

    const cookieStore = await cookies();
    cookieStore.set(cookieData);

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