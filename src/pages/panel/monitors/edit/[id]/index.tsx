import { Alert } from '@/lib/Alert';
import { NextPageWithLayout } from '@/pages/_app';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import IntegrationService from '@/services/IntegrationService';
import IntervalService from '@/services/IntervalService';
import MonitorService from '@/services/MonitorService';
import { MonitorTypeEnum, MonitorTypeLabelEnum } from '@/types/MonitorTypeEnum';
import { ArrowLeftSquare } from 'lucide-react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from "next/image";
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { useEffect, type ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';

type IFormValues = {
  id: string,
  name: string;
  type: string;
  address: string;
  active: boolean;
  integrationList: any[],
  intervalId: string;
}

export const getServerSideProps = (async (context) => {
  const { token } = context.req.cookies;
  const { params } = context;

  let monitorResponse = null;

  if (params && params.id) {
    monitorResponse = await MonitorService.getMonitorById(token as string, params.id as string);
  }

  const { data: intervalResponse } = await IntervalService.getIntervalList(token as string, new URLSearchParams({ page: "0" }));
  const { data: integrationResponse } = await IntegrationService.getIntegrationList(token as string, new URLSearchParams({ page: "0" }));

  return {
    props: {
      monitorResponse: monitorResponse,
      intervalResponse: intervalResponse,
      integrationResponse: integrationResponse
    }
  }
}) satisfies GetServerSideProps<{}>

const EditMonitor: NextPageWithLayout = ({ monitorResponse, integrationResponse, intervalResponse }: any) => {
  const router = useRouter();
  const { token, setLoading } = useGlobalProvider();
  const monitorTypeList = Object.keys(MonitorTypeEnum).map(t => ({ id: t, description: MonitorTypeLabelEnum[t as MonitorTypeEnum] }));

  useEffect(() => {
    setLoading(false);
  }, []);

  const { register, handleSubmit, setValue, watch, control } = useForm<IFormValues>({
    defaultValues: {
      id: monitorResponse.id,
      name: monitorResponse.name,
      type: monitorResponse.type,
      address: monitorResponse.address,
      active: monitorResponse.active,
      integrationList: monitorResponse.integrationList.map((i: any) => i.id),
      intervalId: monitorResponse.intervalId
    }
  });

  async function handleSave(form: IFormValues) {
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        type: form.type,
        address: form.address,
        active: form.active,
        integrationList: form.integrationList,
        intervalId: form.intervalId
      }

      const response = await MonitorService.updateMonitor(token as string, monitorResponse.id, payload);
      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    Alert.confirm("Excluir monitor", "O monitor será excluído permanentemente. Continuar?", async () => {
      setLoading(true);

      try {
        const response = await MonitorService.deleteMonitor(token as string, id);
        router.replace("/panel/monitors");
        Alert.success("", response.message);
      } catch (error: any) {
        Alert.error("", error.message);
      } finally {
        setLoading(false);
      }
    });
  }

  return (
    <>
      <Head>
        <title>Monitores • Systatus.Live</title>
      </Head>

      <div className="flex items-center space-x-2 mb-6">
        <ArrowLeftSquare className="cursor-pointer" onClick={() => {
          setLoading(true);
          router.back();
        }} />
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Monitor</h1>
          <small>ID: {monitorResponse.id}</small>
        </div>
      </div>
      <div>
        <form onSubmit={handleSubmit(handleSave)} className="grid grid-cols-12 gap-3 border-1 border-gray-200 p-6 rounded-lg">
          <div className="col-span-12 lg:col-span-4">
            <label className="block">Nome <span className="text-red-500">*</span></label>
            <InputText {...register("name", { required: true })} maxLength={30} placeholder="Ex.: API de pagamentos" className="p-inputtext-sm" />
            <small>{watch("name")?.length ?? 0}/30</small>
          </div>
          <div className="col-span-12 lg:col-span-2">
            <label className="block">Tipo <span className="text-red-500">*</span></label>
            <Controller name="type" control={control} rules={{ required: true }} render={({ field }) => (
              <Dropdown
                {...field}
                inputRef={field.ref}
                value={watch("type")}
                onChange={(option) => setValue("type", option.value)}
                options={monitorTypeList}
                optionValue="id"
                optionLabel="description"
                filter={true}
                itemTemplate={(option) => (
                  <span>{option.description}</span>
                )}
                valueTemplate={(option) => (option == null ? <div>&#8203;</div> : <span>{option.description}</span>)}
                className="p-inputtext-sm"
              />
            )} />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <label className="block">IP ou URL <span className="text-red-500">*</span></label>
            <InputText {...register("address", { required: true })} maxLength={1000} className="p-inputtext-sm" />
            <small>{watch("address")?.length ?? 0}/1000</small>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <label className="block">Integração <span className="text-red-500">*</span></label>
            <Controller name="integrationList" control={control} rules={{ required: true }} render={({ field }) => (
              <MultiSelect
                {...field}
                inputRef={field.ref}
                value={watch("integrationList")}
                onChange={(option) => setValue("integrationList", option.value)}
                options={integrationResponse}
                optionLabel="name"
                optionValue="id"
                filter={true}
                itemTemplate={(option) => (
                  <div className="flex items-center gap-x-1 w-full overflow-hidden pt-1">
                    <Image src={option.chatPlatformIconUrl} alt="." width={16} height={16} />
                    <span className="font-medium text-sm">{option.name}</span>
                  </div>
                )}
                className="p-inputtext-sm w-full"
              />
            )} />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <label className="block">Intervalo de monitoramento <span className="text-red-500">*</span></label>
            <Controller name="intervalId" control={control} rules={{ required: true }} render={({ field }) => (
              <Dropdown
                {...field}
                inputRef={field.ref}
                value={watch("intervalId")}
                onChange={(option) => setValue("intervalId", option.value)}
                options={intervalResponse}
                optionValue="id"
                optionLabel="name"
                filter={true}
                itemTemplate={(option) => (
                  <span>{option.name}</span>
                )}
                valueTemplate={(option) => (option == null ? <div>&#8203;</div> : <span>{option.name}</span>)}
                className="p-inputtext-sm"
              />
            )} />
            <small>Timeout: 10 segundos</small>
          </div>
          <div className="flex items-center space-x-1 col-span-12 lg:col-span-4">
            <Controller name="active" control={control} render={({ field }) => (
              <Checkbox inputId={field.name} checked={field.value} onChange={(e) => field.onChange(e.checked)} />
            )} />
            <label htmlFor="active" className="block cursor-pointer">Habilitar monitoramento</label>
          </div>
          <div className="flex space-x-4 mt-5 col-span-12">
            <Button label="Salvar" severity="success" type="submit" />
            <Button label="Excluir" text severity="danger" onClick={() => handleDelete(monitorResponse.id!)} type="button" />
          </div>
        </form>
      </div>
    </>
  )
}

EditMonitor.getLayout = function getLayout(page: ReactElement) {
  return page;
}

export default EditMonitor;