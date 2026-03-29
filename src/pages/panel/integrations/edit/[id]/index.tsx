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
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type IFormValues = {
  chatPlatformId: string;
  name: string;
  address: string;
}

const EditIntegration: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const { token, setLoading } = useGlobalProvider();

  const [integration, setIntegration] = useState<any>(null);
  const [platformList, setPlatformList] = useState<any[]>([]);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, watch, control, reset } = useForm<IFormValues>();

  const selectedPlatformId = watch("chatPlatformId");
  const selectedPlatform = platformList.find((p) => p.id === selectedPlatformId);

  useEffect(() => {
    if (!token || !id) return;

    setLoading(true);

    Promise.all([
      IntegrationService.getIntegrationById(token, id as string),
      ChatPlatformService.getChatPlatformList(token, new URLSearchParams({ page: "0" })),
    ]).then(([integrationRes, platformRes]) => {
      setIntegration(integrationRes);
      setPlatformList(platformRes.data);

      reset({
        chatPlatformId: integrationRes.chat_platform_id,
        name: integrationRes.name,
        address: integrationRes.address,
      });
    }).catch((error: any) => {
      Alert.error("", error.message);
    }).finally(() => {
      setLoading(false);
    });
  }, [token, id]);

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
      const response = await IntegrationService.updateIntegration(token as string, integration.id, {
        chatPlatformId: form.chatPlatformId,
        name: form.name,
        address: form.address,
      });

      setIntegration({
        ...integration,
        chat_platform_id: form.chatPlatformId,
        name: form.name,
        address: form.address,
      });
      setIsEditing(false);
      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    reset({
      chatPlatformId: integration.chat_platform_id,
      name: integration.name,
      address: integration.address,
    });
    setIsEditing(false);
  }

  async function handleDelete() {
    Alert.confirm("Excluir integração", "A integração será excluída permanentemente. Continuar?", async () => {
      setLoading(true);
      try {
        const response = await IntegrationService.deleteIntegration(token as string, integration.id);
        router.replace("/panel/integrations");
        Alert.success("", response.message);
      } catch (error: any) {
        Alert.error("", error.message);
      } finally {
        setLoading(false);
      }
    });
  }

  async function handleValidate() {
    setLoading(true);
    try {
      const response = await IntegrationService.validateIntegration(token as string, integration.id);
      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  if (!integration) return null;

  return (
    <>
      <Head>
        <title>Integrações • Systatus.Live</title>
      </Head>

      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold leading-tight">Integração</h1>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            Excluir
          </Button>
          {isEditing ? (
            <>
              <Button type="button" variant="ghost" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit" form="edit-integration-form">
                Salvar alterações
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              <PencilIcon className="h-3.5 w-3.5 mr-1" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <form id="edit-integration-form" onSubmit={handleSubmit(handleSave)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-card p-6 space-y-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Configurações
              </p>
              {!isEditing ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Nome</p>
                    <p className="font-medium">{integration.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Plataforma</p>
                    <div className="flex items-center gap-2">
                      {platformList.find((p) => p.id === integration.chat_platform_id) && (
                        <Image
                          src={platformList.find((p) => p.id === integration.chat_platform_id).icon_url}
                          alt=""
                          width={14}
                          height={14}
                        />
                      )}
                      <p className="font-medium">
                        {platformList.find((p) => p.id === integration.chat_platform_id)?.description}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{getAddressLabel()}</p>
                    <p className="font-medium break-all">{integration.address}</p>
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
          <div>
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Diagnóstico
              </p>
              <p className="text-sm text-muted-foreground">
                Envie uma mensagem de teste para verificar se a integração está funcionando corretamente.
              </p>
              <Button type="button" variant="outline" className="w-full" onClick={handleValidate}>
                Testar integração
              </Button>
            </div>
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

EditIntegration.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default EditIntegration;
