import { NextResponse } from 'next/server';

export async function GET() {
  try {

    return NextResponse.json({
      data: [
        {
          name: "Andorinha",
          price: "Grátis",
          period: "",
          description: "Comece a monitorar em minutos e sem cartão de crédito.",
          cta: "Comece de graça",
          ctaLink: "/auth/signin",
          mostPopular: false,
          features: {
            "5 monitores": true,
            "Monitoramento a cada 5 minutos": true,
            "Notificações no WhatsApp": false,
            "Notificações no Slack": true,
            "Notificações no Google Chat": true,
            "Notificações no e-mail": true,
            "Notificações no Discord": true,
            "Mensagens personalizáveis": false,
            "Página de status pública": false
          },
          image: "/images/bird.png"
        },
        {
          name: "Coruja",
          // price: "R$ 89,90",
          price: "Em Breve",
          // period: "/mês",
          period: "",
          description: "Perfeito para expandir a cobertura de monitoramento.",
          cta: "Em breve",
          ctaLink: "#",
          mostPopular: false,
          features: {
            "🆙 50 monitores": true,
            "🆙 Monitoramento a cada 60 segundos": true,
            "Notificações no WhatsApp": false,
            "Notificações no Slack": true,
            "Notificações no Google Chat": true,
            "Notificações no e-mail": true,
            "Notificações no Discord": true,
            "Mensagens personalizadas": false,
            "🆙 Página de status pública": true
          },
          image: "/images/owl.png"
        },
        {
          name: "Águia",
          // price: "R$ 149,90",
          price: "Em Breve",
          // period: "/mês",
          period: "",
          description: "Mais monitoramento, mensagens personalizadas e alertas no WhatsApp.",
          cta: "Em breve",
          ctaLink: "#",
          mostPopular: false,
          features: {
            "🆙 100 monitores": true,
            "🆙 Monitoramento a cada 60 segundos": true,
            "🆙 Notificações no WhatsApp": true,
            "Notificações no Slack": true,
            "Notificações no Google Chat": true,
            "Notificações no e-mail": true,
            "Notificações no Discord": true,
            "🆙 Mensagens personalizadas": true,
            "🆙 Página de status pública": true
          },
          image: "/images/eagle.png"
        }
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