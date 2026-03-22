import { Alert } from "@/lib/Alert";
import WebhookTutorial from "@/components/Panel/WebhookTutorial";
import { NextPageWithLayout } from "@/pages/_app";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import ChatPlatformService from "@/services/ChatPlatformService";
import IntegrationService from "@/services/IntegrationService";
import { ChatPlatformEnum, ChatPlatformTypeEnum } from "@/types/ChatPlatformEnum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type IFormValues = {
  chatPlatformId: string;
  name: string;
  address: string;
}

const NewIntegration: NextPageWithLayout = () => {
  const router = useRouter();
  const { token, setLoading } = useGlobalProvider();
  const [platformList, setPlatformList] = useState<any[]>([]);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const { register, handleSubmit, watch, control } = useForm<IFormValues>();

  const selectedPlatformId = watch("chatPlatformId");
  const selectedPlatform = platformList.find((p) => p.id === selectedPlatformId);

  useEffect(() => {
    if (!token) return;

    setLoading(true);

    ChatPlatformService.getChatPlatformList(token, new URLSearchParams({ page: "0" })).then(({ data }) => {
      setPlatformList(data);
    }).catch((error: any) => {
      Alert.error("", error.message)
    }).finally(() => {
      setLoading(false)
    });
  }, [token]);

  function getAddressLabel() {
    if (!selectedPlatform) {
      return "URL Webhook";
    }

    switch (selectedPlatform.name) {
      case ChatPlatformEnum.EMAIL:
        return "E-mail";
      case ChatPlatformEnum.WHATSAPP:
        return "Telefone";
      default:
        return "URL Webhook";
    }
  }

  const isWebhookPlatform = selectedPlatform?.type === ChatPlatformTypeEnum.WEBHOOK;

  async function handleSave(form: IFormValues) {
    setLoading(true);
    try {
      const response = await IntegrationService.createIntegration(token as string, {
        chatPlatformId: form.chatPlatformId,
        name: form.name,
        address: form.address,
      });
      Alert.success("", response.message);
      router.replace(`/panel/integrations/edit/${response.data.id}`);
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
        <div>
          <h1 className="text-base font-semibold leading-tight">Nova Integração</h1>
          <p className="text-sm text-muted-foreground">Configure um canal de notificação</p>
        </div>
        <Button type="submit" form="new-integration-form">
          Salvar
        </Button>
      </div>

      <form id="new-integration-form" onSubmit={handleSubmit(handleSave)}>
        <div className="max-w-3xl">
          <div className="rounded-xl border bg-card p-6 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Configurações
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="name">Nome <span className="text-destructive">*</span></FieldLabel>
                  <Input
                    id="name"
                    {...register("name", { required: true })}
                    maxLength={30}
                    placeholder="Ex.: Canal de DevOps"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {watch("name")?.length ?? 0}/30
                  </p>
                </Field>
                <Field>
                  <FieldLabel>Plataforma <span className="text-destructive">*</span></FieldLabel>
                  <Controller
                    name="chatPlatformId"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {platformList.map((platform) => (
                            <SelectItem key={platform.id} value={platform.id}>
                              <div className="flex items-center gap-2">
                                <Image src={platform.icon_url} alt="" width={14} height={14} />
                                {platform.description}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="address">
                  {getAddressLabel()} <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="address"
                  {...register("address", { required: true })}
                  maxLength={1000}
                  placeholder={isWebhookPlatform ? "https://hooks.example.com/..." : undefined}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {watch("address")?.length ?? 0}/1000
                  </p>
                  {isWebhookPlatform && (
                    <button
                      type="button"
                      onClick={() => setIsTutorialOpen(true)}
                      className="text-xs text-primary underline underline-offset-4"
                    >
                      Como obter a URL do Webhook?
                    </button>
                  )}
                </div>
              </Field>
            </div>
          </div>
      </form>
      
      <Dialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Como obter a URL do Webhook</DialogTitle>
          </DialogHeader>
          <WebhookTutorial />
        </DialogContent>
      </Dialog>
    </>
  );
};

NewIntegration.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default NewIntegration;
