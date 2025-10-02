import HttpService from '@/services/HttpService';
import { NextResponse } from 'next/server';
import axios from "axios";

type Payload = {
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string
}

export async function POST(request: Request) {
  try {
    const { name, email, message }: Payload = await request.json();

    await axios.post(`${process.env.RESEND_API_URL}/emails`, {
      from: "Systatus.Live <no-reply@systatus.live>",
      to: process.env.CONTACT_EMAIL,
      subject: "[Nova Mensagem]",
      html: `
        <b>Origem:</b> ${request.headers.get("host") || request.headers.get("x-forwarded-host")}<br>
        <b>Nome:</b> ${name}<br>
        <b>E-mail:</b> ${email}<br>
        <b>Mensagem:</b><br>
        <i>${message}</i>
      `
    }, {
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      }
    })

    return NextResponse.json({
      message: "Mensagem enviada com sucesso!"
    }, {
      status: 200
    });
  } catch (error) {
    return NextResponse.json({
      message: "Erro interno ao enviar a mensagem. Tente novamente ou comunique pelo e-mail no final da página."
    }, {
      status: 500
    });
  }
}