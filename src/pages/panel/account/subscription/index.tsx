import { Alert } from "@/lib/Alert";
import { NextPageWithLayout } from "@/pages/_app";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import InvoiceService from "@/services/InvoiceService";
import PlanService from "@/services/PlanService";
import StripeService from "@/services/StripeService";
import UserService from "@/services/UserService";
import UtilsService from "@/services/UtilsService";
import { InvoiceStatusEnum, InvoiceStatusLabelEnum } from "@/types/InvoiceStatusEnum";
import formatDate from "@/utils/formatDate";
import formatMoney from "@/utils/formatMoney";
import { CheckIcon, CreditCardIcon, DownloadIcon, MapPinIcon, PencilIcon, ReceiptIcon, ShieldCheckIcon, SparklesIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AccountLayout from "../layout";
import { Alert as AlertBox, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SubscriptionStatusEnum } from "@/types/SubscriptionStatusEnum";

type IFormBilling = {
  billing_name: string;
  billing_email: string;
  person_type: "PF" | "PJ";
  document: string;
  zip_code: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  state: string;
  city: string;
};

type StateOption = {
  code: string;
  name: string;
};

const statusVariantMap: Record<InvoiceStatusEnum, { label: string; className: string }> = {
  [InvoiceStatusEnum.PAID]: { label: InvoiceStatusLabelEnum.PAID, className: "bg-green-500/15 text-green-600 border-green-500/20" },
  [InvoiceStatusEnum.PENDING]: { label: InvoiceStatusLabelEnum.PENDING, className: "bg-yellow-500/15 text-yellow-600 border-yellow-500/20" },
  [InvoiceStatusEnum.CANCELED]: { label: InvoiceStatusLabelEnum.CANCELED, className: "bg-muted text-muted-foreground border-border" },
  [InvoiceStatusEnum.DUEDATE]: { label: InvoiceStatusLabelEnum.DUEDATE, className: "bg-red-500/15 text-red-600 border-red-500/20" },
};

function maskCpf(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
    .slice(0, 14);
}

function maskCnpj(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5")
    .slice(0, 18);
}

function maskCep(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
}

const Subscription: NextPageWithLayout = () => {
  const { token, setLoading } = useGlobalProvider();
  const router = useRouter();
  const [planList, setPlanList] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [invoiceList, setInvoiceList] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 0, rows: 0, total: 0 });
  const [billingData, setBillingData] = useState<any>(null);
  const [billingExpanded, setBillingExpanded] = useState(false);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [citySearch, setCitySearch] = useState("");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  const billingForm = useForm<IFormBilling>({
    defaultValues: {
      billing_name: "",
      billing_email: "",
      person_type: "PF",
      document: "",
      zip_code: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      state: "",
      city: "",
    },
  });

  const { control, register, watch, setValue, handleSubmit, reset } = billingForm;

  const personType = watch("person_type");

  const filteredCities = cities.filter((c) => c.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 100);

  useEffect(() => {
    if (!router.isReady) return;

    const { status } = router.query;

    if (status === "success") {
      Alert.success("", "Assinatura realizada com sucesso!");
    } else if (status === "cancel") {
      Alert.info("", "Assinatura cancelada.");
    }
  }, [router.isReady, router.query.status]);

  useEffect(() => {
    if (token) {
      loadData();
      loadStates();
      loadBillingData();
      loadInvoices(0);
    }
  }, [token]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const [subResponse, planResponse] = await Promise.all([
        UserService.getUserSubscription(token!),
        PlanService.getPlanList(),
      ]);

      setSubscription(subResponse);
      setPlanList(planResponse.data);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadStates() {
    try {
      const response = await UtilsService.getStates(token!);
      setStates(response);
    } catch { }
  }

  async function loadCities(stateCode: string) {
    if (!stateCode) return;

    try {
      const response = await UtilsService.getCities(token!, stateCode);
      setCities(response);
    } catch {
      setCities([]);
    }
  }

  async function loadBillingData() {
    try {
      const response = await UserService.getUserBillingData(token!);
      setBillingData(response);

      if (response?.person_type) {
        reset({
          billing_name: response.billing_name ?? "",
          billing_email: response.billing_email ?? "",
          person_type: response.person_type,
          document: response.document ?? "",
          zip_code: response.zip_code ?? "",
          address: response.address ?? "",
          number: response.number ?? "",
          complement: response.complement ?? "",
          neighborhood: response.neighborhood ?? "",
          state: response.state ?? "",
          city: response.city ?? "",
        });

        setCitySearch(response.city ?? "");

        if (response.state) {
          await loadCities(response.state);
        }
      }
    } catch { }
  }

  async function loadInvoices(page: number) {
    setLoading(true);

    try {
      const params = new URLSearchParams({ page: page.toString() });
      const response = await InvoiceService.getInvoiceList(token as string, params);

      setInvoiceList(response.data);

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

  async function handleSubscribe(planId: string) {
    if (!billingData?.billing_name) {
      Alert.info("", "Preencha os dados de cobrança antes de assinar um plano pago.");
      setBillingExpanded(true);
      return;
    }

    setLoading(true);

    try {
      const response = await StripeService.createCheckoutSession(token!, planId);
      window.location.href = response.url;
    } catch (error: any) {
      Alert.error("", error.message ?? "Falha ao iniciar o checkout.");
      setLoading(false);
    }
  }

  async function onSubmitBilling(form: IFormBilling) {
    setLoading(true);

    try {
      const response = await UserService.updateUserBillingData(token!, form);
      Alert.success("", response.message);
      setBillingData(form);
      setBillingExpanded(false);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCepBlur(cep: string) {
    const clean = cep.replace(/\D/g, "");

    if (clean.length !== 8) return;

    setLoading(true);

    try {
      const response = await UtilsService.getCep(token!, clean);
      setValue("address", response.address);
      setValue("neighborhood", response.neighborhood);
      setValue("state", response.state);
      setValue("city", response.city);
      setCitySearch(response.city);

      await loadCities(response.state);
    } catch {
      Alert.error("", "CEP não encontrado.");
    } finally {
      setLoading(false);
    }
  }

  async function getInvoicePDF(id: string) {
    setLoading(true);

    try {
      const response = await InvoiceService.getInvoicePDF(token!, id);
      const blob = await response.blob();

      const disposition = response.headers.get("content-disposition");
      let filename = "invoice.pdf";

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.target = "_blank";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch {
      Alert.error("", "Falha ao gerar o PDF");
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(pagination.total / pagination.rows);

  const billingAddressLine = billingData ? [billingData.address, billingData.number, billingData.complement].filter(Boolean).join(", ") : "";

  const billingLocationLine = billingData
    ? [billingData.neighborhood, billingData.city && billingData.state ? `${billingData.city}/${billingData.state}` : billingData.city || billingData.state, billingData.zip_code,].filter(Boolean).join(" - ")
    : "";

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Assinatura atual</h2>
        </div>
        <Separator className="mb-6" />

        {subscription && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border p-5">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 shrink-0">
                  <Image src={subscription.image} alt="Plano" fill sizes="48px" style={{ objectFit: "contain" }} priority />
                </div>
                <div>
                  <p className="font-semibold">Plano {subscription.name}</p>
                  <p className="text-sm text-muted-foreground">{subscription.nextBilling}</p>
                </div>
              </div>
              {subscription.status == SubscriptionStatusEnum.TRIAL ? (
                <span className="text-3xl font-bold">
                  Trial
                </span>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {formatMoney(subscription.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">{subscription.period}</span>
                </div>
              )}
            </div>

            <div className="rounded-lg border p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Dados de cobrança</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBillingExpanded(!billingExpanded)}
                >
                  <PencilIcon className="h-3.5 w-3.5 mr-1" />
                  {billingExpanded ? "Cancelar" : "Editar"}
                </Button>
              </div>

              {billingExpanded ? (
                <form onSubmit={handleSubmit(onSubmitBilling)} className="mt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    <Field>
                      <FieldLabel htmlFor="billing_name">Nome para cobrança <span className="text-destructive">*</span></FieldLabel>
                      <Input
                        id="billing_name"
                        {...register("billing_name", { required: true })}
                        placeholder="Nome ou razão social"
                        maxLength={100}
                      />
                    </Field>

                    <Field className="lg:col-span-2">
                      <FieldLabel htmlFor="billing_email">E-mail para cobrança <span className="text-destructive">*</span></FieldLabel>
                      <Input
                        id="billing_email"
                        {...register("billing_email", { required: true })}
                        type="email"
                        placeholder="cobranca@empresa.com"
                        maxLength={255}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Tipo de pessoa <span className="text-destructive">*</span></FieldLabel>
                      <Controller
                        name="person_type"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              setValue("document", "");
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PF">Pessoa Física</SelectItem>
                              <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="document">
                        {personType === "PF" ? "CPF" : "CNPJ"} <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id="document"
                        {...register("document", { required: true })}
                        onChange={(e) => {
                          const masked = personType === "PF" ? maskCpf(e.target.value) : maskCnpj(e.target.value);
                          setValue("document", masked);
                        }}
                        placeholder={personType === "PF" ? "000.000.000-00" : "00.000.000/0000-00"}
                        maxLength={personType === "PF" ? 14 : 18}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="zip_code">CEP <span className="text-destructive">*</span></FieldLabel>
                      <Input
                        id="zip_code"
                        {...register("zip_code", { required: true })}
                        onChange={(e) => {
                          setValue("zip_code", maskCep(e.target.value));
                        }}
                        onBlur={(e) => handleCepBlur(e.target.value)}
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </Field>

                    <div className="col-span-full grid grid-cols-[3fr_6rem_2fr] gap-4">
                      <Field>
                        <FieldLabel htmlFor="address">Endereço <span className="text-destructive">*</span></FieldLabel>
                        <Input
                          id="address"
                          {...register("address", { required: true })}
                          placeholder="Rua, avenida, logradouro..."
                          maxLength={255}
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="number">Número <span className="text-destructive">*</span></FieldLabel>
                        <Input
                          id="number"
                          {...register("number", { required: true })}
                          placeholder="123"
                          maxLength={20}
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="complement">Complemento</FieldLabel>
                        <Input
                          id="complement"
                          {...register("complement")}
                          placeholder="Apto, sala, bloco..."
                          maxLength={100}
                        />
                      </Field>
                    </div>

                    <div className="col-span-full grid grid-cols-[1fr_5rem_1fr] gap-4">
                      <Field>
                        <FieldLabel htmlFor="neighborhood">Bairro <span className="text-destructive">*</span></FieldLabel>
                        <Input
                          id="neighborhood"
                          {...register("neighborhood", { required: true })}
                          placeholder="Bairro"
                          maxLength={100}
                        />
                      </Field>

                      <Field>
                        <FieldLabel>UF <span className="text-destructive">*</span></FieldLabel>
                        <Controller
                          name="state"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={async (value) => {
                                field.onChange(value);
                                setValue("city", "");
                                setCitySearch("");
                                setCities([]);
                                await loadCities(value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="..." />
                              </SelectTrigger>
                              <SelectContent>
                                {states.map((s) => (
                                  <SelectItem key={s.code} value={s.code}>
                                    {s.code}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </Field>

                      <Field>
                        <FieldLabel>Cidade <span className="text-destructive">*</span></FieldLabel>
                        <Controller
                          name="city"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <div ref={cityRef} className="relative">
                              <Input
                                value={citySearch}
                                onChange={(e) => {
                                  setCitySearch(e.target.value);
                                  field.onChange(e.target.value);
                                  setCityDropdownOpen(true);
                                }}
                                onFocus={() => {
                                  if (cities.length > 0) setCityDropdownOpen(true);
                                }}
                                placeholder={cities.length === 0 ? "Selecione..." : "Buscar..."}
                                disabled={cities.length === 0}
                              />
                              {cityDropdownOpen && filteredCities.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-48 overflow-y-auto">
                                  {filteredCities.map((city) => (
                                    <button
                                      key={city}
                                      type="button"
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        field.onChange(city);
                                        setCitySearch(city);
                                        setCityDropdownOpen(false);
                                      }}
                                    >
                                      {city}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        />
                      </Field>
                    </div>

                    <div className="flex items-end pb-0.5">
                      <Button type="submit" size="sm">Salvar alterações</Button>
                    </div>
                  </div>

                  <AlertBox className="mt-4">
                    <ShieldCheckIcon />
                    <AlertTitle>Seus dados estão protegidos</AlertTitle>
                    <AlertDescription>
                      <p>
                        As informações do seu cartão de crédito são processadas diretamente pelo{" "}
                        <a href="https://stripe.com/br" target="_blank" rel="noreferrer">Stripe</a>
                        {" "}— uma das plataformas de pagamento mais seguras do mundo. Esses dados nunca trafegam nem são armazenados em nossos servidores.
                      </p>
                      <p>
                        Os dados de endereço e documento preenchidos aqui são armazenados em nossa base exclusivamente para fins de emissão de nota fiscal.
                        Em qualquer momento, você pode cancelar sua assinatura sem burocracia.
                      </p>
                      <p>
                        Ao assinar um plano, você concorda com os nossos{" "}
                        <a href="/agreements/privacy-policy" target="_blank" rel="noreferrer">Termos de Uso</a>
                        {" "}e a nossa{" "}
                        <a href="/agreements/terms-of-use" target="_blank" rel="noreferrer">Política de Privacidade</a>.
                      </p>
                    </AlertDescription>
                  </AlertBox>
                </form>
              ) : (
                billingData?.billing_name ? (
                  <div className="mt-3 space-y-0.5 text-sm text-muted-foreground">
                    <p className="text-foreground font-medium">{billingData.billing_name}</p>
                    <p>{billingData.person_type === "PF" ? "CPF" : "CNPJ"}: {billingData.document}</p>
                    {billingAddressLine && <p>{billingAddressLine}</p>}
                    {billingLocationLine && <p>{billingLocationLine}</p>}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">Nenhum dado de cobrança preenchido.</p>
                )
              )}
            </div>
          </div>
        )}
      </section>

      {planList.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Planos disponíveis</h2>
          </div>
          <Separator className="mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planList.map((plan, index) => (
              <div
                key={index}
                className={`relative flex flex-col rounded-lg border p-6 ${plan.mostPopular ? "border-primary shadow-md" : ""}`}
              >
                {plan.mostPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-0.5 text-xs">Mais Popular</Badge>
                  </div>
                )}

                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="relative h-12 w-12">
                    <Image src={plan.image} alt="Plano" fill sizes="48px" style={{ objectFit: "contain" }} priority />
                  </div>
                  <p className="font-semibold text-sm">Plano {plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {formatMoney(plan.price)}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground mb-4">{plan.description}</p>

                <ul className="flex-1 space-y-2.5 mb-6">
                  {plan.features.map((feature: any) => (
                    <li key={feature.label} className="flex items-center gap-2 text-sm">
                      {feature.enabled
                        ? <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />
                        : <XIcon className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                      }
                      <span className={feature.enabled ? "" : "text-muted-foreground"}>{feature.label}</span>
                    </li>
                  ))}
                </ul>

                {subscription?.id === plan.id && subscription.status != SubscriptionStatusEnum.TRIAL ? (
                  <Button variant="outline" className="w-full" size="sm" disabled>
                    Plano atual
                  </Button>
                ) : (
                  <div className="space-y-1.5">
                    <Button
                      variant={plan.mostPopular ? "default" : "outline"}
                      className="w-full"
                      size="sm"
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {plan.bta}
                    </Button>
                    {!billingData?.billing_name && (
                      <p className="text-xs text-center text-muted-foreground">
                        Dados de cobrança necessários
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-2 mb-4">
          <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Histórico de faturas</h2>
        </div>
        <Separator className="mb-6" />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fatura</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Emissão</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhuma fatura encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                invoiceList.map((invoice) => {
                  const status = statusVariantMap[invoice.status as InvoiceStatusEnum];
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium text-sm font-mono">{invoice.id}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-x-2">
                          <div className="relative h-5 w-5">
                            <Image src={invoice.image} alt="Plano" fill sizes="20px" style={{ objectFit: "contain" }} priority />
                          </div>
                          <span>{invoice.plan}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{formatDate(invoice.issue_date, "DD/MM/YYYY")}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{formatDate(invoice.due_date, "DD/MM/YYYY")}</TableCell>
                      <TableCell className="text-sm">{formatMoney(invoice.amount)}</TableCell>
                      <TableCell>
                        {status && (
                          <Badge variant="outline" className={`text-xs ${status.className}`}>
                            {status.label}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="Baixar PDF"
                          onClick={() => getInvoicePDF(invoice.id)}
                        >
                          <DownloadIcon className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {pagination.total > 0 && (
          <div className="flex items-center justify-between pt-3 text-sm text-muted-foreground">
            <span>{pagination.total} faturas</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 0}
                onClick={() => loadInvoices(pagination.page - 1)}
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
                onClick={() => loadInvoices(pagination.page + 1)}
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

Subscription.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default Subscription;
