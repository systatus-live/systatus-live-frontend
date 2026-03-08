import { NextPageWithLayout } from '@/pages/_app';
import Head from 'next/head';
import { ReactElement } from 'react';

const Integrations: NextPageWithLayout = ({ monitorResponse }: any) => {
  return (
     <>
      <Head>
        <title>Integrações • Systatus.Live</title>
      </Head>

      <div>
        Integrações
      </div>
    </>
  )
}

Integrations.getLayout = function getLayout(page: ReactElement) {
  return page;
}

export default Integrations;