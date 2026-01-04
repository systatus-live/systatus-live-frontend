import ContactForm from '@/components/ContactForm';
import { NextPageWithLayout } from '@/pages/_app';
import Head from 'next/head';
import { type ReactElement } from 'react';
import PanelLayout from '../layout';

const Help: NextPageWithLayout = () => {
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
  return (
    <PanelLayout>
      {page}
    </PanelLayout>
  )
}

export default Help;