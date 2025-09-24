import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Systatus Live",
  description: "Notificações instantâneas quando seus sites, APIs ou servidores ficarem indisponíveis. Mantenha o controle da sua infraestrutura com monitoramento e alertas em tempo real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <title>Systatus.Live</title>
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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
