import IntegrationForm from '@/components/Panel/IntegrationForm';
import { NextPageWithLayout } from '@/pages/_app';
import { ArrowLeftSquare } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { type ReactElement } from 'react';
import PanelLayout from '../../../layout';

const EditIntegration: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Integrações • Systatus.Live</title>
      </Head>

      <div className="flex items-center space-x-2 mb-6">
        <ArrowLeftSquare className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-xl font-bold">Integração</h1>
      </div>

      <div>
        <IntegrationForm id={router.query.id as string} />
      </div>
    </>
  )
}

EditIntegration.getLayout = function getLayout(page: ReactElement) {
  return (
    <PanelLayout>
      {page}
    </PanelLayout>
  )
}

export default EditIntegration;