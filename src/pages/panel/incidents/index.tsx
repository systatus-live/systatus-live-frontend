import { NextPageWithLayout } from '@/pages/_app';
import Head from 'next/head';
import { ReactElement } from 'react';

const Incidents: NextPageWithLayout = ({ monitorResponse }: any) => {
  return (
     <>
      <Head>
        <title>Incidentes • Systatus.Live</title>
      </Head>

      <div>
        Incidentes
      </div>
    </>
  )
}

Incidents.getLayout = function getLayout(page: ReactElement) {
  return page;
}

export default Incidents;