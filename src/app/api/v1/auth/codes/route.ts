import AuthService from '@/services/AuthService';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    const json = await request.json();

    let response = await AuthService.checkCode(json.code);

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