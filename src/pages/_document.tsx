import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head>
        <meta name="description" content="Notificações instantâneas quando seus sites, APIs ou servidores ficarem indisponíveis. Mantenha o controle da sua infraestrutura com monitoramento e alertas em tempo real." />

        <meta property="og:url" content="https://systatus.live" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Systatus.Live" />
        <meta property="og:description" content="Notificações instantâneas quando seus sites, APIs ou servidores ficarem indisponíveis. Mantenha o controle da sua infraestrutura com monitoramento e alertas em tempo real." />
        <meta property="og:image" content="https://systatus.live/_next/image?url=%2Flogos%2Fsystatus-live.png&w=32&q=75" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="systatus.live" />
        <meta property="twitter:url" content="https://systatus.live" />
        <meta name="twitter:title" content="Systatus.Live" />
        <meta name="twitter:description" content="Notificações instantâneas quando seus sites, APIs ou servidores ficarem indisponíveis. Mantenha o controle da sua infraestrutura com monitoramento e alertas em tempo real." />
        <meta name="twitter:image" content="https://systatus.live/_next/image?url=%2Flogos%2Fsystatus-live.png&w=32&q=75" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}