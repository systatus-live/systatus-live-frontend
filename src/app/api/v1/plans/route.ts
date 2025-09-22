import { NextResponse } from 'next/server';

export async function GET() {
  try {

    return NextResponse.json({
      data: [
        {
          name: "Grátis",
          price: "R$ 0",
          period: "/mês",
          description: "Não requer cartão de crédito",
          limits: "Até 5 monitores",
          cta: "Comece de graça",
          mostPopular: false,
          features: {
            "Até 5 monitores": true,
            "Intervalo de verificação de 5 min.": true,
            "Integração com Slack": true,
            "Integração com Discord": true,
            "Integração com Google Chat": true,
            "Mensagens personalizáveis": false,
            "Página de status pública": false
          }
        },
        {
          name: "Pro",
          price: "Em breve",
          period: "",
          description: "Perfeito para expandir seu monitoramento",
          limits: "Até 50 monitores",
          cta: "Adquirir agora",
          mostPopular: true,
          features: {
            "Até 50 monitores": true,
            "Intervalo de verificação de 1   min.": true,
            "Integração com Slack": true,
            "Integração com Discord": true,
            "Integração com Google Chat": true,
            "Mensagens personalizáveis": true,
            "Página de status pública": true
          }
        },
      ]
    }, {
      status: 200
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Erro interno ao buscar planos. Tente novamente ou comunique o suporte."
    }, {
      status: 500
    });
  }
}