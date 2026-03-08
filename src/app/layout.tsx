import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { geistMono, geistSans, inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Systatus.Live",
  description: "Notificações instantâneas quando seus sites, APIs ou servidores ficarem indisponíveis. Mantenha o controle da sua infraestrutura com monitoramento e alertas em tempo real.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br" className={cn("font-sans", inter.variable)}>
      <head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />

        <meta property="og:url" content="https://systatus.live" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Systatus.Live" />
        <meta property="og:description" content={metadata.description as string} />
        <meta property="og:image" content="https://systatus.live/logos/systatus-live.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="systatus.live" />
        <meta property="twitter:url" content="https://systatus.live" />
        <meta name="twitter:title" content="Systatus.Live" />
        <meta name="twitter:description" content={metadata.description as string} />
        <meta name="twitter:image" content="https://systatus.live/logos/systatus-live.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
