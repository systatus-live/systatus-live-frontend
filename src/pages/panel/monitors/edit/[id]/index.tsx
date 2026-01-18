import MonitorForm from '@/components/Panel/MonitorForm';
import { NextPageWithLayout } from '@/pages/_app';
import { ArrowLeftSquare } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { type ReactElement } from 'react';

const EditMonitor: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Monitores • Systatus.Live</title>
      </Head>

      <div className="flex items-center space-x-2 mb-6">
        <ArrowLeftSquare className="cursor-pointer" onClick={() => router.back()} />
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Monitor</h1>
          <small>ID: {router.query.id}</small>
        </div>
      </div>
      <div>
        <MonitorForm id={router.query.id as string} />
      </div>
    </>
  )
}

EditMonitor.getLayout = function getLayout(page: ReactElement) {
  return page;
}

export default EditMonitor;