import { Alert } from "@/lib/Alert";
import { NextPageWithLayout } from "@/pages/_app";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import MonitorService from "@/services/MonitorService";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import DataTable from "@/components/Panel/Monitors/DataTable";

const Monitors: NextPageWithLayout = () => {
  const router = useRouter();
  const { token, setLoading } = useGlobalProvider();
  const [monitorList, setMonitorList] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    MonitorService.getMonitorList(token as string, new URLSearchParams({ page: "0" })).then(response => {
      setMonitorList(response.data);
    }).catch(error => {
      Alert.error("", error.message);
    }).finally(() => {
      setLoading(false);
    });
  }, [token]);

  return (
    <>
      <Head>
        <title>Monitores • Systatus.Live</title>
      </Head>

      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">Monitores</h1>
        <Button onClick={() => router.push("/panel/monitors/new")}>
          Novo Monitor
        </Button>
      </div>

      <DataTable data={monitorList} />
    </>
  )
}

Monitors.getLayout = function getLayout(page: ReactElement) {
  return page;
}

export default Monitors;