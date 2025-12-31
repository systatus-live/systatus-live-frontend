"use client"

import Loading from '@/components/Loading';
import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import StatisticService from '@/services/StatisticService';
import { getHttpStatusKey, HttpStatusCodeLabel } from '@/types/HttpStatusCode';
import formatDate from '@/utils/formatDate';
import ReactECharts from 'echarts-for-react';
import { SirenIcon } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { DataView } from 'primereact/dataview';
import { Skeleton } from 'primereact/skeleton';
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
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Estatísticas da sua conta</p>
        </div>
      </div>

      <div className="px-5 py-6">
        {statistic == null ? (
          <>
            <div className={styles["statistic-grid"]}>
              <Skeleton width="100%" height="25vh"></Skeleton>
              <Skeleton width="100%" height="25vh"></Skeleton>
              <Skeleton width="100%" height="25vh"></Skeleton>
            </div>
          </>
        ) : (
          <>
            <div className={styles["statistic-grid"]}>
              {/* Active incidents */}
              <div className="border-1 border-gray-200 rounded-lg p-3 bg-white">
                <div>
                  {statistic.activeIncidentList.length > 0 &&
                    <>
                      <h1 className="font-bold text-sm mb-3">Incidentes ativos</h1>
                      <div style={{ maxHeight: "30vh", overflowY: "auto" }} className="border-1 border-gray-200 rounded-lg px-3 bg-white flex flex-col">
                        <DataView
                          value={statistic.activeIncidentList}
                          listTemplate={(list: any) => (
                            list.map((incident: any, index: number) => (
                              <div key={index} className={`py-2 ${index != (list.length - 1) ? "border-b-1 border-b-gray-200" : ""}`}>
                                <div className="grid grid-cols-1">
                                  <div className="flex items-center gap-x-2 text-sm">
                                    <div>
                                      <SirenIcon size={18} className={`${styles["blink"]} ${styles["font-danger"]}`} />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                      <span className="font-medium overflow-hidden whitespace-nowrap text-ellipsis">{incident.name} ({incident.address})</span>
                                      <small>Desde: {formatDate(incident.createdAt, "DD/MM/YYYY HH:mm")} ({incident.duration})</small>
                                      <small>Status: {HttpStatusCodeLabel[getHttpStatusKey(incident.lastStatus) as keyof typeof HttpStatusCodeLabel]}</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )))}
                          paginator={false}
                        />
                      </div>
                    </>
                  }
                  {statistic.activeIncidentList.length == 0 &&
                    <div>
                      <h1 className="font-bold text-sm mb-3">Nenhum incidente ativo</h1>
                      <Image src="/images/happy.svg" alt="" width={300} height={80} />
                    </div>
                  }
                </div>
              </div>
              {/* Latest incidents */}
              <div className="flex flex-col border-1 border-gray-200 rounded-lg p-6 bg-white">
                <h1 className="font-bold text-sm mb-6">Incidentes nos últimos 30 dias</h1>
                <ReactECharts option={{
                  tooltip: {
                    trigger: "axis"
                  },
                  xAxis: [
                    {
                      data: statistic.monthIncidentList.map((incident: any) => incident.date)
                    }
                  ],
                  yAxis: [
                    {}
                  ],
                  grid: [
                    {
                      left: "0%",
                      right: "0%",
                      top: "0%",
                      bottom: "0%"
                    },
                  ],
                  series: [
                    {
                      type: "line",
                      showSymbol: true,
                      data: statistic.monthIncidentList.map((incident: any) => incident.total),
                      lineStyle: {
                        color: "#FDC700"
                      },
                      itemStyle: {
                        color: "#FDC700"
                      },
                      areaStyle: {
                        color: '#fdc60054'
                      },
                      smooth: false
                    },
                  ]
                }} style={{ width: "100%", height: "25vh" }} />
              </div>
              <div className={styles["total-grid"]}>
                {statistic.total.map((row: any) => (
                  <div key={row.label} className="border-1 border-gray-200 bg-white rounded-lg p-3">
                    <h1>{row.value}</h1>
                    <p>{row.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
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