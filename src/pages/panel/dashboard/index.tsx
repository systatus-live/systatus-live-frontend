import Loading from '@/components/Loading';
import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import StatisticService from '@/services/StatisticService';
import { getHttpStatusKey, HttpStatusCodeLabel } from '@/types/HttpStatusCode';
import formatDate from '@/utils/formatDate';
import { ArrowBigDownDashIcon, RadarIcon, WaypointsIcon } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { DataView } from 'primereact/dataview';
import { useEffect, useState, type ReactElement } from 'react';
import PanelLayout from '../layout';
import styles from "./styles.module.scss";

const Dashboard: NextPageWithLayout = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statistic, setStatistic] = useState<any>();
  const { token } = useGlobalProvider();

  useEffect(() => {
    if (token) {
      search(new URLSearchParams())
    }
  }, [token]);

  async function search(params: URLSearchParams) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await StatisticService.getPanelStatistics(token as string, params);
      setStatistic(response);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

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

      {statistic &&
        <div className="px-5 py-6">
          {/* Totals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-6">
            <div className="border-1 border-gray-200 rounded-lg p-3 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-sm">Monitores cadastrados</h1>
                  <p className={styles["total-count"]}>{statistic.totals.monitors}</p>
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
                  <p className={styles["total-count"]}>{statistic.currentIncidentList.length}</p>
                </div>
                <div className={`${styles["total-icon-danger"]} rounded-lg`}>
                  <ArrowBigDownDashIcon />
                </div>
              </div>
            </div>
            <div className="border-1 border-gray-200 rounded-lg p-3 bg-white flex justify-between items-center">
              <div>
                <h1 className="text-sm">Integrações cadastradas</h1>
                <p className={styles["total-count"]}>{statistic.totals.integrations}</p>
              </div>
              <div className={`${styles["total-icon-default"]} rounded-lg`}>
                <WaypointsIcon />
              </div>
            </div>
          </div>
          {/* Actives downtimes */}
          <div className="border-1 border-gray-200 rounded-lg mt-3 p-3 bg-white flex flex-col">
            <h1 className="text-sm font-medium">Incidentes ativos</h1>
            {statistic.currentIncidentList.length == 0 ? (
              <div>
                <Image src="/images/network.svg" alt="" width={80} height={80} />
                <span className="text-sm">Não há incidentes ativos.</span>
              </div>
            ) : (
              <div>
                <DataView
                  value={statistic.currentIncidentList}
                  listTemplate={(list: any) => (
                    list.map((monitor: any, index: number) => (
                      <div key={index} className={`${index != (list.length - 1) ? "border-b-1 border-b-gray-200" : ""}`}>
                        <div className="flex items-center gap-x-2 text-sm py-2">
                          <ArrowBigDownDashIcon size={18} className={`${styles["blink"]} ${styles["font-danger"]}`} />
                          <div className="flex flex-col">
                            <span>{monitor.name} ({monitor.address}) - {HttpStatusCodeLabel[getHttpStatusKey(monitor.status) as keyof typeof HttpStatusCodeLabel]} ({monitor.status})</span>
                            <small>{formatDate(monitor.createdAt, "DD/MM/YYYY HH:mm")}</small>
                          </div>
                        </div>
                      </div>
                    )))}
                  paginator={false}
                />
              </div>
            )}
          </div>
          {/* Latest downloads */}
          <div className="border-1 border-gray-200 rounded-lg mt-3 p-3 bg-white flex flex-col">
            <h1 className="text-sm font-medium">Incidentes resolvidos nos últimos 7 dias</h1>
            {statistic.lastIncidentList.length == 0 ? (
              <div>
                <Image src="/images/rocket-launch.svg" alt="" width={80} height={80} />
                <span className="text-sm">Não houveram incidentes nos últimos 7 dias.</span>
              </div>
            ) : (
              <div>
                <DataView
                  value={statistic.lastIncidentList}
                  listTemplate={(list: any) => (
                    list.map((incident: any, index: number) => (
                      <div key={index} className={`${index != (list.length - 1) ? "border-b-1 border-b-gray-200" : ""}`}>
                        <div className="flex flex-col text-sm font-medium py-2">
                          <span>{incident.name} ({incident.address}) - {HttpStatusCodeLabel[getHttpStatusKey(incident.status) as keyof typeof HttpStatusCodeLabel]} ({incident.status})</span>
                          <small>{formatDate(incident.createdAt, "DD/MM/YYYY HH:mm")}</small>
                        </div>
                      </div>
                    )))}
                  paginator={false}
                />
              </div>
            )}
          </div>
        </div>
      }
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