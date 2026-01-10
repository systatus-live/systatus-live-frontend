import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import AuthService from '@/services/AuthService';
import { jwtDecode } from 'jwt-decode';
import { SignInOptionsDTO } from '@/types/SignInOptionsDTO';
import { SignInTypeEnum } from '@/types/SignInTypeEnum';

export async function POST(request: Request) {
  try {
    const json: SignInOptionsDTO = await request.json();
    
    let response = null;
    switch (json.type) {
      case SignInTypeEnum.GOOGLE:
        response = await AuthService.signIn(json);
        break;
      case SignInTypeEnum.EMAIL_PASSWORD:
        response = await AuthService.signIn(json);
        break;
      default:
        throw new Error("Tipo de autenticação desconhecido.");
    }

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