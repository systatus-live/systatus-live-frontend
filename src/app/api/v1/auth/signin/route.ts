import { NextResponse } from 'next/server';
import axios from "axios";
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const json = await request.json();

    const response = await axios.post(`${process.env.SYSTATUS_API_URL}/v1/auth/signin`, json);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: response.data.data.access_token,
      httpOnly: true,
      path: "/",
      secure: process.env.ENV === "PROD",
    })

    return NextResponse.json(response.data, {
      status: response.status
    });
  } catch (error: any) {
    return NextResponse.json(error.response.data, {
      status: error.response.status
    });
  }
}