import { Alert } from "@/lib/Alert";
import { NextPageWithLayout } from "@/pages/_app";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import MonitorService from "@/services/MonitorService";
import StatusPageService from "@/services/StatusPageService";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import Head from "next/head";
import { ReactElement, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import normalizeSlug from "@/utils/normalizeSlug";

type IFormValues = {
  title: string;
  slug: string;
  active: boolean;
  monitorIdList: string[];
};

const StatusPagePanel: NextPageWithLayout = () => {
  const { token, setLoading } = useGlobalProvider();
  const [monitorList, setMonitorList] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const { register, handleSubmit, setValue, watch, control, reset } = useForm<IFormValues>({
    defaultValues: {
      active: true,
      monitorIdList: []
    },
  });

  useEffect(() => {
    if (!token) return;

    setLoading(true);

    Promise.all([
      StatusPageService.getStatusPage(token),
      MonitorService.getMonitorList(token, new URLSearchParams({ page: "0" })),
    ]).then(([statusPageRes, monitorRes]) => {

      setMonitorList(monitorRes.data);

      if (statusPageRes) {
        setIsEdit(true);

        reset({
          title: statusPageRes.title,
          slug: statusPageRes.slug,
          active: statusPageRes.active,
          monitorIdList: statusPageRes.monitorIdList ?? [],
        });
      }
    }).catch((error: any) => {
      if (error?.status !== 404) {
        Alert.error("", error.message);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [token]);

  async function handleSave(form: IFormValues) {
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        active: form.active,
        monitorIdList: form.monitorIdList,
      };

      const response = isEdit ? await StatusPageService.updateStatusPage(token as string, payload) : await StatusPageService.createStatusPage(token as string, payload);

      Alert.success("", response.message);
      setIsEdit(true);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleMonitor(monitorId: string, checked: boolean, current: string[]) {
    if (checked) {
      setValue("monitorIdList", [...current, monitorId]);
    } else {
      setValue("monitorIdList", current.filter((id) => id !== monitorId));
    }
  }

  const slug = watch("slug");

  return (
    <>
      <Head>
        <title>Página de Status • Systatus.Live</title>
      </Head>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold leading-tight">Página de Status</h1>
          <p className="text-sm text-muted-foreground">
            Configure a página pública de status dos seus serviços
          </p>
        </div>
        <Button type="submit" form="status-page-form">
          Salvar
        </Button>
      </div>

      <form id="status-page-form" onSubmit={handleSubmit(handleSave)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border bg-card p-6 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Configurações gerais
              </p>
              <Field>
                <FieldLabel htmlFor="title">
                  Título <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="title"
                  {...register("title", { required: true })}
                  maxLength={60}
                  placeholder="Ex.: Status Minha Empresa"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {watch("title")?.length ?? 0}/60
                </p>
              </Field>
              <Field>
                <FieldLabel htmlFor="slug">
                  Subdomínio <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="flex items-center gap-0">
                  <Controller
                    name="slug"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        id="slug"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(normalizeSlug(e.target.value))}
                        maxLength={40}
                        placeholder="minhaempresa"
                        className="rounded-r-none border-r-0 z-10"
                      />
                    )}
                  />
                  <span className="inline-flex items-center h-9 px-3 text-sm text-muted-foreground bg-muted border border-input rounded-r-md shrink-0">
                    .systatus.live
                  </span>
                </div>
                {slug && (
                  <p className="text-xs text-muted-foreground">
                    Sua página ficará disponível em{" "}
                    <span className="font-medium">https://{slug}.systatus.live</span>
                  </p>
                )}
              </Field>
            </div>

            <div className="rounded-xl border bg-card p-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Monitores exibidos
              </p>
              <Controller
                name="monitorIdList"
                control={control}
                render={({ field }) => (
                  <div className="rounded-lg border divide-y max-h-72 overflow-y-auto">
                    {monitorList.length === 0 && (
                      <p className="text-sm text-muted-foreground px-3 py-3">
                        Nenhum monitor disponível.
                      </p>
                    )}
                    {monitorList.map((monitor) => {
                      const isChecked = field.value?.includes(monitor.id);
                      return (
                        <label
                          key={monitor.id}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => toggleMonitor(monitor.id, !!checked, field.value ?? [])}
                          />
                          <span className="text-sm font-medium">{monitor.name}</span>
                          <span className="text-xs text-muted-foreground truncate">
                            {monitor.address}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Visualização
              </p>
              {isEdit && slug ? (
                <a
                  href={`https://${slug}.systatus.live`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline underline-offset-4 break-all"
                >
                  https://{slug}.systatus.live
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Salve a página para ver o link público.
                </p>
              )}
              <Separator />
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                    <div>
                      <span className="text-sm font-medium">Habilitar página</span>
                      <p className="text-xs text-muted-foreground">
                        Ativa ou desativa o acesso público.
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

StatusPagePanel.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default StatusPagePanel;
