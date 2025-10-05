import "../styles/globals.scss";
import type { AppProps } from 'next/app'
import type { Metadata, NextPage } from "next";
import { Analytics } from "@vercel/analytics/next"
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import { createContext, ReactElement, ReactNode } from "react";
import { GlobalProvider } from "@/providers/GlobalProvider";

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

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <GlobalProvider>
      <Head>
        <title>Systatus.Live</title>
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <Analytics />
        {getLayout(<Component {...pageProps} />)}
      </div>
    </GlobalProvider>
  )
}