import { Alert } from "@/lib/Alert";
import { NextPageWithLayout } from "@/pages/_app";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import IntegrationService from "@/services/IntegrationService";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import DataTable from "@/components/Panel/Integrations/DataTable";

const Integrations: NextPageWithLayout = () => {
  const router = useRouter();
  const { token, setLoading } = useGlobalProvider();
  const [integrationList, setIntegrationList] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;

    setLoading(true);

    IntegrationService.getIntegrationList(token, new URLSearchParams({ page: "0" })).then((response) => {
      setIntegrationList(response.data);
    }).catch((error: any) => {
      Alert.error("", error.message);
    }).finally(() => {
      setLoading(false);
    });
  }, [token]);

  async function handleValidate(id: string) {
    setLoading(true);
    try {
      const response = await IntegrationService.validateIntegration(token as string, id);
      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Integrações • Systatus.Live</title>
      </Head>

      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">Integrações</h1>
        <Button onClick={() => router.push("/panel/integrations/new")}>
          Nova Integração
        </Button>
      </div>

      <DataTable data={integrationList} onValidate={handleValidate} />
    </>
  );
};

Integrations.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default Integrations;
