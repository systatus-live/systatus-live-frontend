import IntegrationForm from '@/components/Panel/IntegrationForm';
import { NextPageWithLayout } from '@/pages/_app';
import { ArrowLeftSquare } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { type ReactElement } from 'react';

const NewIntegration: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Integrações • Systatus.Live</title>
      </Head>

      <div className="flex items-center space-x-2 mb-6">
        <ArrowLeftSquare className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-xl font-bold">Nova Integração</h1>
      </div>
      <div>
        <IntegrationForm id={null} />
      </div>
    </>
  )
}

NewIntegration.getLayout = function getLayout(page: ReactElement) {
  return page;
}

export default NewIntegration;