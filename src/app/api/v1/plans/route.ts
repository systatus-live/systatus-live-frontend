import { NextResponse } from 'next/server';

export async function GET() {
  try {

    return NextResponse.json({
      data: [
        {
          name: "Grátis",
          price: "R$ 0,00",
          period: "/mês",
          description: "Não requer cartão de crédito",
          limits: "Até 5 monitores",
          cta: "Comece de graça",
          ctaLink: "/auth/signin",
          mostPopular: false,
          features: {
            "Até 5 monitores": true,
            "Intervalo de verificação de 5 min.": true,
            "Notificações no Slack": true,
            "Notificações no Google Chat": true,
            "Notificações por e-mail": true,
            "Notificações no WhatsApp": false,
            "Notificações no Discord": true,
            "Notificações no Telegram": true,
            "Mensagens personalizáveis": false,
            "Página de status pública": false
          }
        },
        {
          name: "Pro",
          price: "Em breve",
          period: "/mês",
          description: "Perfeito para expandir seu monitoramento",
          limits: "Até 50 monitores",
          // cta: "Adquirir agora",
          cta: "Em breve",
          ctaLink: "#",
          mostPopular: true,
          features: {
            "Até 50 monitores": true,
            "Intervalo de verificação de 1   min.": true,
            "Notificações no Slack": true,
            "Notificações no Google Chat": true,
            "Notificações por e-mail": true,
            "Notificações no WhatsApp": true,
            "Notificações no Discord": true,
            "Notificações no Telegram": true,
            "Mensagens personalizáveis": true,
            "Página de status pública": true
          }
        },
      ]
    }, {
      status: 200
    });
  } catch (error) {
    return NextResponse.json({
      message: "Erro interno ao buscar planos. Tente novamente ou comunique o suporte."
    }, {
      status: 500
    });
  }
}