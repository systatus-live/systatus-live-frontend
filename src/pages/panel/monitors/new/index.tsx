import MonitorForm from '@/components/Panel/MonitorForm';
import { NextPageWithLayout } from '@/pages/_app';
import { ArrowLeftSquare } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { type ReactElement } from 'react';
import PanelLayout from '../../layout';

const NewMonitor: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Monitores • Systatus.Live</title>
      </Head>

      <div className="flex items-center space-x-2 mb-6">
        <ArrowLeftSquare className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-xl font-bold">Novo Monitor</h1>
      </div>
      <div>
        <MonitorForm id={null} />
      </div>
    </>
  )
}

NewMonitor.getLayout = function getLayout(page: ReactElement) {
  return (
    <PanelLayout>
      {page}
    </PanelLayout>
  )
}

export default NewMonitor;