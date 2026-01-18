import Loading from '@/components/Loading';
import { Alert } from '@/lib/Alert';
import { useGlobalProvider } from '@/providers/GlobalProvider';
import IntegrationService from '@/services/IntegrationService';
import IntervalService from '@/services/IntervalService';
import MonitorService from '@/services/MonitorService';
import { MonitorTypeEnum, MonitorTypeLabelEnum } from '@/types/MonitorTypeEnum';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Skeleton } from 'primereact/skeleton';
import { useEffect, useState } from 'react';
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

export default function MonitorForm(props: { id: string | null }) {
  const router = useRouter();
  const { token } = useGlobalProvider();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);
  const [integrationList, setIntegrationList] = useState([]);
  const [intervalList, setIntervalList] = useState([]);
  const monitorTypeList = Object.keys(MonitorTypeEnum).map(t => ({ id: t, description: MonitorTypeLabelEnum[t as MonitorTypeEnum] }));

  const { register, handleSubmit, reset, setValue, watch, control } = useForm<IFormValues>({});

  useEffect(() => {
    if (token) {
      (async () => {
        const [interval] = await getIntervalList(new URLSearchParams());
        await getIntegrationList(new URLSearchParams());

        if (props.id) {
          await getMonitor(props.id);
        } else {
          reset({
            active: true,
            intervalId: interval.id,
            type: monitorTypeList[0].id
          });
        }

        setFirstLoading(false);
      })();
    }
  }, [token]);

  async function handleSave(form: IFormValues) {
    setIsSubmitting(true);

    try {
      let response = null;

      const payload = {
        name: form.name,
        type: form.type,
        address: form.address,
        active: form.active,
        integrationList: form.integrationList,
        intervalId: form.intervalId
      }

      if (props.id) {
        response = await MonitorService.updateMonitor(token as string, props.id, payload);
      } else {
        response = await MonitorService.createMonitor(token as string, payload);
        router.replace(`/panel/monitors/edit/${response.data.id}`);
      }
      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    Alert.confirm("Excluir monitor", "O monitor será excluído permanentemente. Continuar?", async () => {
      setIsSubmitting(true);

      try {
        const response = await MonitorService.deleteMonitor(token as string, id);
        router.replace("/panel/monitors");
        Alert.success("", response.message);
      } catch (error: any) {
        Alert.error("", error.message);
      } finally {
        setIsSubmitting(false);
      }
    });
  }

  async function getIntegrationList(params: URLSearchParams) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    params.set("page", "0");

    try {
      const { data } = await IntegrationService.getIntegrationList(token as string, params);
      setIntegrationList(data);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function getIntervalList(params: URLSearchParams) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    params.set("page", "0");

    try {
      const { data } = await IntervalService.getIntervalList(token as string, params);
      setIntervalList(data);
      return data;
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function getMonitor(id: string) {
    setIsSubmitting(true);

    try {
      const response = await MonitorService.getMonitorById(token as string, id);

      reset({
        id: response.id,
        name: response.name,
        type: response.type,
        address: response.address,
        active: response.active,
        integrationList: response.integrationList.map((i: any) => i.id),
        intervalId: response.intervalId
      })
    } catch (error: any) {
      if (error.status == 404) {
        await router.push("/panel/integrations");
      }
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {isSubmitting && <Loading />}

      {firstLoading ? (
        <Skeleton width="100%" height="10vh"></Skeleton>
      ) : (
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
                options={integrationList}
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
                options={intervalList}
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
            {props.id && <Button label="Excluir" text severity="danger" onClick={() => handleDelete(props.id!)} type="button" />}
          </div>
        </form>
      )}
    </>
  )
}