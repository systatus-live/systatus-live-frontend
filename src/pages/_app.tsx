import { GlobalProvider } from "@/providers/GlobalProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, NextPage } from "next";
import type { AppProps } from 'next/app';
import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import "../styles/globals.scss";
import "primereact/resources/themes/viva-light/theme.css";
import * as cowsay from "cowsay";
import { useEffect } from "react";

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

  useEffect(() => {
    console.log(cowsay.say({
      text: "👀 Olá, dev!\nCaso encontre algo estranho (além deste aviso), conte pra gente em\nhttps://systatus.live/contact"
    }))
  }, []);

  return (
    <GlobalProvider>
      <Head>
        <title>Systatus.Live</title>
      </Head>

      {/* Vercel */}
      <Analytics />
      <SpeedInsights />

      <div>
        {getLayout(<Component {...pageProps} />)}
      </div>
    </GlobalProvider>
  )
}