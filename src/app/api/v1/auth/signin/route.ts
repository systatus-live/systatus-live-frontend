import AuthService from '@/services/AuthService';
import { SignInOptionsDTO } from '@/types/SignInOptionsDTO';
import { SignInTypeEnum } from '@/types/SignInTypeEnum';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const json: SignInOptionsDTO = await request.json();

    const headers = {
      "x-user-agent": request.headers.get("user-agent"),
      "x-client-ip": request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
      captcha: request.headers.get("captcha")
    };

    let response = null;
    switch (json.type) {
      case SignInTypeEnum.GOOGLE:
        response = await AuthService.signIn(json, headers);

        // O "signUpSignInFlow" inicia um fluxo que direciona o usuário para o signUp se fizer o signIn com alguma rede social sem estar cadastrado
        if (response.data.signUpSignInFlow) {
          return NextResponse.json(response.data, {
            status: response.status
          });
        }

        break;
      case SignInTypeEnum.EMAIL_PASSWORD:
        response = await AuthService.signIn(json, headers);
        break;
      default:
        throw new Error("Tipo de autenticação desconhecido.");
    }

    const accessToken = response.data.access_token;
    const decodedToken = jwtDecode(accessToken);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: accessToken,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(decodedToken.exp! * 1000), // "exp" is in seconds, convert to milliseconds
      maxAge: decodedToken.exp! - decodedToken.iat! // maxAge in seconds
    });

    return NextResponse.json(response.data, {
      status: 200
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error.message
    }, {
      status: 401
    });
  }
}