import { Alert } from "@/lib/Alert";
import { NextPageWithLayout } from "@/pages/_app";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import IntegrationService from "@/services/IntegrationService";
import IntervalService from "@/services/IntervalService";
import MonitorService from "@/services/MonitorService";
import { MonitorTypeEnum, MonitorTypeLabelEnum } from "@/types/MonitorTypeEnum";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type IFormValues = {
  name: string;
  type: string;
  address: string;
  active: boolean;
  integrationList: string[];
  intervalId: string;
}

const monitorTypeList = Object.entries(MonitorTypeEnum).map(([key]) => ({
  id: key,
  description: MonitorTypeLabelEnum[key as MonitorTypeEnum],
}));

const EditMonitor: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const { token, setLoading } = useGlobalProvider();

  const [monitor, setMonitor] = useState<any>(null);
  const [intervalList, setIntervalList] = useState<any[]>([]);
  const [integrationList, setIntegrationList] = useState<any[]>([]);

  const { register, handleSubmit, setValue, watch, control, reset } = useForm<IFormValues>();

  useEffect(() => {
    if (!token || !id) return;

    setLoading(true);
    
    Promise.all([
      MonitorService.getMonitorById(token, id as string),
      IntervalService.getIntervalList(token, new URLSearchParams({ page: "0" })),
      IntegrationService.getIntegrationList(token, new URLSearchParams({ page: "0" })),
    ]).then(([monitorRes, intervalRes, integrationRes]) => {
        setMonitor(monitorRes);
        setIntervalList(intervalRes.data);
        setIntegrationList(integrationRes.data);

        reset({
          name: monitorRes.name,
          type: monitorRes.type,
          address: monitorRes.address,
          active: monitorRes.active,
          integrationList: monitorRes.integrationList.map((i: any) => i.id),
          intervalId: monitorRes.interval_id,
        });
      }).catch((error: any) => {
        Alert.error("", error.message);
      }).finally(() => {
        setLoading(false);
      });
  }, [token, id]);

  async function handleSave(form: IFormValues) {
    setLoading(true);
    try {
      const response = await MonitorService.updateMonitor(token as string, monitor.id, {
        name: form.name,
        type: form.type,
        address: form.address,
        active: form.active,
        integrationList: form.integrationList,
        intervalId: form.intervalId,
      });
      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    Alert.confirm("Excluir monitor", "O monitor será excluído permanentemente. Continuar?", async () => {
      setLoading(true);
      try {
        const response = await MonitorService.deleteMonitor(token as string, monitor.id);
        router.replace("/panel/monitors");
        Alert.success("", response.message);
      } catch (error: any) {
        Alert.error("", error.message);
      } finally {
        setLoading(false);
      }
    });
  }

  function toggleIntegration(integrationId: string, checked: boolean, current: string[]) {
    if (checked) {
      setValue("integrationList", [...current, integrationId]);
    } else {
      setValue("integrationList", current.filter((i) => i !== integrationId));
    }
  }

  if (!monitor) return null;

  return (
    <>
      <Head>
        <title>Monitores • Systatus.Live</title>
      </Head>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold leading-tight">Editar Monitor</h1>
          <p className="text-sm text-muted-foreground">{monitor.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            Excluir
          </Button>
          <Button type="submit" form="edit-monitor-form">
            Salvar alterações
          </Button>
        </div>
      </div>
      <form id="edit-monitor-form" onSubmit={handleSubmit(handleSave)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border bg-card p-6 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Configurações básicas
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="name">Nome <span className="text-destructive">*</span></FieldLabel>
                  <Input
                    id="name"
                    {...register("name", { required: true })}
                    maxLength={30}
                    placeholder="Ex.: API de pagamentos"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {watch("name")?.length ?? 0}/30
                  </p>
                </Field>
                <Field>
                  <FieldLabel>Tipo <span className="text-destructive">*</span></FieldLabel>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {monitorTypeList.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="address">IP ou URL <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id="address"
                  {...register("address", { required: true })}
                  maxLength={1000}
                  placeholder="https://exemplo.com"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {watch("address")?.length ?? 0}/1000
                </p>
              </Field>
            </div>
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Integrações
              </p>
              <Controller
                name="integrationList"
                control={control}
                render={({ field }) => (
                  <div className="rounded-lg border divide-y max-h-56 overflow-y-auto">
                    {integrationList.length === 0 && (
                      <p className="text-sm text-muted-foreground px-3 py-3">
                        Nenhuma integração disponível.{" "}
                        <Link href="/panel/integrations/new" className="text-primary underline underline-offset-4">
                          Criar integração
                        </Link>
                      </p>
                    )}
                    {integrationList.map((integration) => {
                      const isChecked = field.value?.includes(integration.id);
                      return (
                        <label
                          key={integration.id}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              toggleIntegration(integration.id, !!checked, field.value ?? [])
                            }
                          />
                          <Image
                            src={integration.chatPlatformIconUrl}
                            alt=""
                            width={16}
                            height={16}
                            className="shrink-0"
                          />
                          <span className="text-sm font-medium">{integration.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Monitoramento
              </p>
              <Field>
                <FieldLabel>Intervalo <span className="text-destructive">*</span></FieldLabel>
                <Controller
                  name="intervalId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {intervalList.map((interval) => (
                          <SelectItem key={interval.id} value={interval.id}>
                            {interval.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-xs text-muted-foreground">Timeout: 10 segundos</p>
              </Field>
              <Separator />
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Switch
                      id="active"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                    <div>
                      <span className="text-sm font-medium">Habilitar monitoramento</span>
                      <p className="text-xs text-muted-foreground">
                        Ativa ou pausa as verificações automáticas.
                      </p>
                    </div>
                  </label>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

EditMonitor.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default EditMonitor;
