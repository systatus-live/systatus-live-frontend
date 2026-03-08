import { NextPageWithLayout } from '@/pages/_app';
import Head from 'next/head';
import { ReactElement } from 'react';

const Monitors: NextPageWithLayout = ({ monitorResponse }: any) => {
  return (
    <>
      <Head>
        <title>Monitores • Systatus.Live</title>
      </Head>

      <div>
        Monitors
      </div>
    </>
  )
}

Monitors.getLayout = function getLayout(page: ReactElement) {
  return page;
}

export default Monitors;