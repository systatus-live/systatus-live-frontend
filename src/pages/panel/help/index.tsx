import ContactForm from "@/components/ContactForm";
import { NextPageWithLayout } from "@/pages/_app";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import Head from "next/head";
import { useEffect, type ReactElement } from "react";

const Help: NextPageWithLayout = () => {
  const { setLoading } = useGlobalProvider();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>Ajuda • Systatus.Live</title>
      </Head>

      <ContactForm />
    </>
  )
}

Help.getLayout = function getLayout(page: ReactElement) {
  return page;
}

export default Help;