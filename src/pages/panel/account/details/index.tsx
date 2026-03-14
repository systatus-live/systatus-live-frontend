import { Alert } from "@/lib/Alert";
import { NextPageWithLayout } from "@/pages/_app";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import UserService from "@/services/UserService";
import { SignInTypeEnum } from "@/types/SignInTypeEnum";
import formatDate from "@/utils/formatDate";
import UAParser from "my-ua-parser";
import { CalendarIcon, KeyRoundIcon, MonitorIcon, ShieldIcon, Trash2Icon, UploadIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import AccountLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type IFormDetails = {
  name: string;
  email: string;
  createdAt: string;
  avatar: string | File | null;
};

type IFormPassword = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type AuthHistoryItem = {
  id: string;
  createdAt: string;
  locationJson: { city: string; state: string; country: string; flag: string } | null;
  ip: string;
  userAgent: string;
};

const Details: NextPageWithLayout = () => {
  const { user, setUser, token, setLoading } = useGlobalProvider();
  const [isChangedAvatar, setIsChangedAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [authHistory, setAuthHistory] = useState<AuthHistoryItem[]>([]);
  const [pagination, setPagination] = useState({ page: 0, rows: 0, total: 0 });
  const inputFileRef = useRef<HTMLInputElement>(null);

  const detailsForm = useForm<IFormDetails>({
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      createdAt: user?.createdAt ? formatDate(user.createdAt, "D [de] MMMM [de] YYYY") : "",
      avatar: user?.avatar ?? null,
    },
  });

  const passwordForm = useForm<IFormPassword>({
    values: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
  });

  useEffect(() => {
    if (token) {
      loadAuthHistory(0);
    }
  }, [token]);

  async function loadAuthHistory(page: number) {
    setLoading(true);

    try {
      const params = new URLSearchParams({ page: page.toString() });
      const response = await UserService.getAuthHistory(token as string, params);

      setAuthHistory(response.data);

      setPagination((prev) => ({
        ...prev,
        page,
        rows: response.pagination.rows,
        total: response.pagination.total,
      }));
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitDetails(form: IFormDetails) {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);

      if (isChangedAvatar) {
        const avatar = detailsForm.getValues("avatar");
        if (avatar) {
          formData.append("avatar", avatar);
        } else {
          formData.append("rmAvatar", "1");
        }
      }

      const response = await UserService.updateUserDetails(token as string, formData);

      setUser({
        ...user,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar,
      });

      if (isChangedAvatar) {
        if (avatarPreview) {
          URL.revokeObjectURL(avatarPreview);
        }
        setAvatarPreview(null);
        detailsForm.setValue("avatar", response.data.avatar);
        setIsChangedAvatar(false);
      }

      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitPassword(form: IFormPassword) {
    setLoading(true);

    try {
      const response = await UserService.updateUserPassword(token as string, {
        newPassword: form.newPassword,
        currentPassword: form.currentPassword,
      });

      setUser({
        ...user,
        signinType: SignInTypeEnum.EMAIL_PASSWORD,
      });

      passwordForm.reset();

      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  function onUploadAvatar() {
    if (!inputFileRef.current?.files) {
      return;
    }

    const file = inputFileRef.current.files[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image") || file.size > 1024 * 1024) {
      Alert.info("", "Imagem inválida. Use JPG ou PNG com no máximo 1MB.");
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(URL.createObjectURL(file));
    detailsForm.setValue("avatar", file);
    setIsChangedAvatar(true);
    inputFileRef.current.value = "";
  }

  function onDeleteAvatar() {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarPreview(null);

    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }

    detailsForm.setValue("avatar", null);
    setIsChangedAvatar(true);
  }

  function getAvatarSrc(): string {
    if (avatarPreview) {
      return avatarPreview;
    }

    const avatar = detailsForm.watch("avatar");

    if (!avatar) {
      return "/images/avatar.jpg";
    }

    return avatar as string;
  }

  function getDevice(userAgent: string): string {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    if (result.browser.name) {
      return `${result.os.name} • ${result.browser.name} ${result.browser.version}`;
    }

    return userAgent;
  }

  const totalPages = Math.ceil(pagination.total / pagination.rows);

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Perfil</h2>
        </div>
        <Separator className="mb-6" />

        <form onSubmit={detailsForm.handleSubmit(onSubmitDetails)}>
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border bg-muted">
                <Image src={getAvatarSrc()} alt="Avatar" fill sizes="96px" style={{ objectFit: "cover" }} priority />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="upload-avatar"
                  ref={inputFileRef}
                  type="file"
                  className="hidden"
                  accept="image/jpg,image/jpeg,image/png"
                  onChange={onUploadAvatar}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  title="Enviar foto"
                  onClick={() => document.getElementById("upload-avatar")?.click()}
                >
                  <UploadIcon className="h-3.5 w-3.5" />
                </Button>
                {detailsForm.watch("avatar") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    title="Remover foto"
                    onClick={onDeleteAvatar}
                  >
                    <Trash2Icon className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <span className="text-xs text-muted-foreground">Máx. 1 MB</span>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="name">Nome <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id="name"
                  {...detailsForm.register("name", { required: true })}
                  maxLength={50}
                  placeholder="Seu nome"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {detailsForm.watch("name")?.length ?? 0}/50
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">E-mail <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id="email"
                  {...detailsForm.register("email", { required: true })}
                  type="email"
                  maxLength={255}
                  placeholder="seu@email.com"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {detailsForm.watch("email")?.length ?? 0}/255
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="createdAt" className="flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  Membro desde
                </FieldLabel>
                <Input id="createdAt" {...detailsForm.register("createdAt")} disabled />
              </Field>

              <div className="sm:col-span-2 flex justify-end pt-2">
                <Button type="submit" size="sm">Salvar alterações</Button>
              </div>
            </div>
          </div>
        </form>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <ShieldIcon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Segurança</h2>
        </div>
        <Separator className="mb-6" />

        <div className="flex items-center gap-2 mb-4">
          <KeyRoundIcon className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Alterar senha</h3>
        </div>

        <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            {user?.signinType === SignInTypeEnum.EMAIL_PASSWORD && (
              <Field>
                <FieldLabel htmlFor="currentPassword">Senha atual <span className="text-destructive">*</span></FieldLabel>
                <Input id="currentPassword" {...passwordForm.register("currentPassword", { required: true })} type="password" placeholder="••••••••" />
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="newPassword">Nova senha <span className="text-destructive">*</span></FieldLabel>
              <Input id="newPassword" {...passwordForm.register("newPassword", { required: true })} type="password" placeholder="••••••••" />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirmar senha <span className="text-destructive">*</span></FieldLabel>
              <Input id="confirmPassword" {...passwordForm.register("confirmPassword", { required: true })} type="password" placeholder="••••••••" />
            </Field>
            <div className="sm:col-span-3 flex justify-end pt-2">
              <Button type="submit" size="sm">Atualizar senha</Button>
            </div>
          </div>
        </form>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <MonitorIcon className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Histórico de acesso</h3>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Dispositivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                authHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-sm font-medium whitespace-nowrap">
                      {formatDate(item.createdAt, "DD/MM/YYYY HH:mm")}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.locationJson
                        ? `${item.locationJson.city} • ${item.locationJson.state} • ${item.locationJson.country} ${item.locationJson.flag}`
                        : <span className="text-muted-foreground">Desconhecida</span>
                      }
                    </TableCell>
                    <TableCell className="text-sm font-mono">{item.ip}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{getDevice(item.userAgent)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination.total > 0 && (
          <div className="flex items-center justify-between pt-3 text-sm text-muted-foreground">
            <span>{pagination.total} entradas</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 0}
                onClick={() => loadAuthHistory(pagination.page - 1)}
              >
                Anterior
              </Button>
              <Badge variant="outline" className="font-normal">
                {pagination.page + 1} / {totalPages || 1}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page + 1 >= totalPages}
                onClick={() => loadAuthHistory(pagination.page + 1)}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

Details.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default Details;
