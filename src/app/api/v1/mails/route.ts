import { NextResponse } from 'next/server';
import nodemailer from "nodemailer";

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

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_FROM_PASSWORD
      },
    });

    await transporter.sendMail({
      from: `Nova mensagem <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject: "[Systatus.Live] Nova mensagem",
      html: `
        <b>Origem:</b> ${request.headers.get("host") || request.headers.get("x-forwarded-host")}<br>
        <b>Nome:</b> ${name}<br>
        <b>E-mail:</b> ${email}<br>
        <b>Mensagem:</b><br>
        <i>${message}</i>
      `
    })

    return NextResponse.json({
      message: "Mensagem enviada com sucesso!"
    }, {
      status: 200
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Erro interno ao enviar a mensagem. Tente novamente ou comunique pelo e-mail no final da página."
    }, {
      status: 500
    });
  }
}