import Loading from '@/components/Loading';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import { ArrowDownCircle, RadarIcon, WaypointsIcon } from 'lucide-react';
import Head from 'next/head';
import { useEffect, useState, type ReactElement } from 'react';
import PanelLayout from '../layout';
import styles from "./styles.module.scss";
import Image from 'next/image';

const Dashboard: NextPageWithLayout = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useGlobalProvider();

  useEffect(() => {
    if (token) {
    }
  }, [token]);


  return (
    <>
      <Head>
        <title>Dashboard • Systatus.Live</title>
      </Head>

      {isSubmitting && <Loading />}

      <div className="flex items-center justify-between px-6 py-4 bg-white">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Estatísticas da sua conta</p>
        </div>
      </div>

      <div className="px-5 py-6">
        {/* Totals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-6">
          <div className="border-1 border-gray-200 rounded-lg p-3 bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-sm">Monitores cadastrados</h1>
                <p className={styles["total-count"]}>0</p>
              </div>
              <div className={`${styles["total-icon-success"]} rounded-lg`}>
                <RadarIcon />
              </div>
            </div>
          </div>
          <div className="border-1 border-gray-200 rounded-lg p-3 bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-sm">Incidentes ativos</h1>
                <p className={styles["total-count"]}>0</p>
              </div>
              <div className={`${styles["total-icon-danger"]} rounded-lg`}>
                <ArrowDownCircle />
              </div>
            </div>
          </div>
          <div className="border-1 border-gray-200 rounded-lg p-3 bg-white flex justify-between items-center">
            <div>
              <h1 className="text-sm">Integrações cadastradas</h1>
              <p className={styles["total-count"]}>0</p>
            </div>
            <div className={`${styles["total-icon-default"]} rounded-lg`}>
              <WaypointsIcon />
            </div>
          </div>
        </div>
        {/* Actives downtimes */}
        <div className="border-1 border-gray-200 rounded-lg mt-3 p-3 bg-white flex flex-col">
          <h1 className="text-sm">Incidentes ativos</h1>
          <div>
            <Image src="/images/network.svg" alt="" width={80} height={80} />
            <span className="text-sm">Não há incidentes ativos.</span>
          </div>
        </div>
        {/* Actives uptimes */}
        <div className="border-1 border-gray-200 rounded-lg mt-3 p-3 bg-white flex flex-col">
          <h1 className="text-sm">Incidentes nos últimos 7 dias</h1>
          <div>
            <Image src="/images/rocket-launch.svg" alt="" width={80} height={80} />
            <span className="text-sm">Não houveram incidentes nos últimos 7 dias.</span>
          </div>
        </div>
      </div>
    </>
  )
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <PanelLayout>
      {page}
    </PanelLayout>
  )
}

export default Dashboard;