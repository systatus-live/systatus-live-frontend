import { Component, OnInit, inject, signal, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { formatMoney } from "../../../../utils/format-money";
import { firstValueFrom } from "rxjs";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideCreditCard, lucideMapPin, lucidePencil, lucideSparkles, lucideReceipt, lucideShieldCheck, lucideCheck, lucideX, lucideDownload } from "@ng-icons/lucide";
import { AppStateService } from "../../../../state/app-state.service";
import { User } from "../../../../services/user";
import { Invoice } from "../../../../services/invoice";
import { PlanService } from "../../../../services/plan.service";
import { Stripe } from "../../../../services/stripe";
import { Utils } from "../../../../services/utils";
import { Alert } from "../../../../lib/alert";
import { SubscriptionStatusEnum } from "../../../../types/subscription-status.enum";
import { InvoiceStatusEnum, InvoiceStatusLabelEnum } from "../../../../types/invoice-status.enum";
import { HlmButton } from "../../../../components/button/src";
import { HlmInput } from "../../../../components/input/src";
import { HlmLabel } from "../../../../components/label/src";
import { HlmTableImports } from "../../../../components/table/src";
import { HlmBadgeImports } from "../../../../components/badge/src";
import { HlmSeparatorImports } from "../../../../components/separator/src";
import { HlmSelectImports } from "../../../../components/select/src";
import { HlmTooltipImports } from "@spartan-ng/helm/tooltip";

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

export const invoiceStatusVariantMap: Record<InvoiceStatusEnum, { label: string; className: string }> = {
  [InvoiceStatusEnum.PAID]: { label: InvoiceStatusLabelEnum.PAID, className: "bg-green-500/15 text-green-600 border-green-500/20" },
  [InvoiceStatusEnum.PENDING]: { label: InvoiceStatusLabelEnum.PENDING, className: "bg-yellow-500/15 text-yellow-600 border-yellow-500/20" },
  [InvoiceStatusEnum.CANCELED]: { label: InvoiceStatusLabelEnum.CANCELED, className: "bg-muted text-muted-foreground border-border" },
  [InvoiceStatusEnum.DUEDATE]: { label: InvoiceStatusLabelEnum.DUEDATE, className: "bg-red-500/15 text-red-600 border-red-500/20" },
};

@Component({
  selector: "app-subscription",
  imports: [
    RouterLink,
    ReactiveFormsModule,
    DatePipe,
    NgIcon,
    HlmButton,
    HlmInput,
    HlmLabel,
    ...HlmTableImports,
    ...HlmBadgeImports,
    ...HlmSeparatorImports,
    ...HlmSelectImports,
    HlmTooltipImports
  ],
  providers: [
    provideIcons({
      lucideCreditCard,
      lucideMapPin,
      lucidePencil,
      lucideSparkles,
      lucideReceipt,
      lucideShieldCheck,
      lucideCheck,
      lucideX,
      lucideDownload,
    }),
  ],
  templateUrl: "./subscription.html",
  styleUrl: "./subscription.scss",
})
export class Subscription implements OnInit {
  private readonly appState = inject(AppStateService);
  private readonly userService = inject(User);
  private readonly invoiceService = inject(Invoice);
  private readonly planService = inject(PlanService);
  private readonly stripeService = inject(Stripe);
  private readonly utilsService = inject(Utils);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  public readonly SubscriptionStatusEnum = SubscriptionStatusEnum;
  public readonly invoiceStatusVariantMap = invoiceStatusVariantMap;

  public readonly subscription = signal<any>(null);
  public readonly planList = signal<any[]>([]);
  public readonly invoiceList = signal<any[]>([]);
  public readonly pagination = signal({ page: 0, rows: 0, total: 0 });
  public readonly billingData = signal<any>(null);
  public readonly billingExpanded = signal(false);
  public readonly states = signal<{ code: string; name: string }[]>([]);
  public readonly cities = signal<string[]>([]);
  public readonly citySearch = signal("");
  public readonly cityDropdownOpen = signal(false);

  public get totalPages(): number {
    const { total, rows } = this.pagination();
    return rows > 0 ? Math.ceil(total / rows) : 1;
  }

  public get billingAddressLine(): string {
    const b = this.billingData();
    if (!b) { return ""; }
    return [b.address, b.number, b.complement].filter(Boolean).join(", ");
  }

  public get billingLocationLine(): string {
    const b = this.billingData();
    if (!b) { return ""; }
    const cityState = b.city && b.state ? `${b.city}/${b.state}` : b.city || b.state;
    return [b.neighborhood, cityState, b.zip_code].filter(Boolean).join(" - ");
  }

  public get filteredCities(): string[] {
    const search = this.citySearch().toLowerCase();
    return this.cities().filter(c => c.toLowerCase().includes(search)).slice(0, 100);
  }

  public readonly billingForm = this.fb.group({
    billing_name: ["", [Validators.required, Validators.maxLength(100)]],
    billing_email: ["", [Validators.required, Validators.email, Validators.maxLength(255)]],
    person_type: ["PF" as "PF" | "PJ", Validators.required],
    document: ["", Validators.required],
    zip_code: ["", Validators.required],
    address: ["", [Validators.required, Validators.maxLength(255)]],
    number: ["", [Validators.required, Validators.maxLength(20)]],
    complement: ["", Validators.maxLength(100)],
    neighborhood: ["", [Validators.required, Validators.maxLength(100)]],
    state: ["", Validators.required],
    city: ["", Validators.required],
  });

  public readonly personTypeItemToString = (v: string) =>
    v === "PF" ? "Pessoa Física" : v === "PJ" ? "Pessoa Jurídica" : v;

  public onPersonTypeChange(value: string | null | undefined) {
    this.billingForm.controls.person_type.setValue((value ?? "PF") as "PF" | "PJ");
    this.billingForm.controls.document.setValue("");
  }

  public readonly stateItemToString = (v: string) => v;

  public readonly formatMoney = formatMoney;

  public getInvoiceStatus(status: string) {
    return this.invoiceStatusVariantMap[status as InvoiceStatusEnum] ?? null;
  }

  public onDocumentInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const personType = this.billingForm.controls.person_type.value;
    const masked = personType === "PF" ? maskCpf(input.value) : maskCnpj(input.value);
    this.billingForm.controls.document.setValue(masked, { emitEvent: false });
    input.value = masked;
  }

  public onCepInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const masked = maskCep(input.value);
    this.billingForm.controls.zip_code.setValue(masked, { emitEvent: false });
    input.value = masked;
  }

  public async onCepBlur() {
    const cep = this.billingForm.controls.zip_code.value?.replace(/\D/g, "") ?? "";
    if (cep.length !== 8) { return; }

    this.appState.loading.set(true);

    try {
      const response: any = await firstValueFrom(this.utilsService.getCep(cep));
      this.billingForm.patchValue({
        address: response.address,
        neighborhood: response.neighborhood,
        state: response.state,
        city: response.city,
      });
      this.citySearch.set(response.city);
      await this.loadCities(response.state);
    } catch {
      Alert.error("", "CEP não encontrado.");
    } finally {
      this.appState.loading.set(false);
    }
  }

  public async onStateChange(value: string) {
    this.billingForm.controls.state.setValue(value);
    this.billingForm.controls.city.setValue("");
    this.citySearch.set("");
    this.cities.set([]);
    await this.loadCities(value);
  }

  public onCitySearchInput(value: string) {
    this.citySearch.set(value);
    this.billingForm.controls.city.setValue(value);
    this.cityDropdownOpen.set(true);
  }

  public selectCity(city: string) {
    this.citySearch.set(city);
    this.billingForm.controls.city.setValue(city);
    this.cityDropdownOpen.set(false);
  }

  public hideCityDropdown() {
    setTimeout(() => {
      this.cityDropdownOpen.set(false);
    }, 150);
  }

  public toggleBilling() {
    this.billingExpanded.update(v => !v);
  }

  public async handleSubscribe(planId: string) {
    if (!this.billingData()?.billing_name) {
      Alert.info("", "Preencha os dados de cobrança antes de assinar um plano pago.");
      this.billingExpanded.set(true);
      return;
    }

    this.appState.loading.set(true);

    try {
      const response: any = await firstValueFrom(this.stripeService.createCheckoutSession(planId));
      if (isPlatformBrowser(this.platformId)) {
        window.location.href = response.url;
      }
    } catch (error: any) {
      Alert.error("", error.message ?? "Falha ao iniciar o checkout.");
      this.appState.loading.set(false);
    }
  }

  public async onSubmitBilling() {
    if (this.billingForm.invalid) { return; }

    this.appState.loading.set(true);

    try {
      const response: any = await firstValueFrom(
        this.userService.updateUserBillingData(this.billingForm.value),
      );
      this.billingData.set(this.billingForm.value);
      this.billingExpanded.set(false);
      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }

  public async loadInvoices(page: number) {
    this.appState.loading.set(true);

    try {
      const params = new URLSearchParams({ page: page.toString() });
      const response: any = await firstValueFrom(this.invoiceService.getInvoiceList(params));
      this.invoiceList.set(response.data);
      this.pagination.set({
        page,
        rows: response.pagination.rows,
        total: response.pagination.total,
      });
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }

  public async getInvoicePDF(id: string) {
    this.appState.loading.set(true);

    try {
      const response = await firstValueFrom(this.invoiceService.getInvoicePDF(id));
      const blob = response.body!;
      const disposition = response.headers.get("content-disposition");
      let filename = "invoice.pdf";

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) { filename = match[1]; }
      }

      if (isPlatformBrowser(this.platformId)) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => { URL.revokeObjectURL(url); }, 1000);
      }
    } catch (error: any) {
      let message = "Falha ao gerar o PDF";
      if (error?.error instanceof Blob) {
        try {
          const text = await error.error.text();
          const json = JSON.parse(text);
          if (json.message) { message = json.message; }
        } catch { }
      } else if (error?.message) {
        message = error.message;
      }
      Alert.error("", message);
    } finally {
      this.appState.loading.set(false);
    }
  }

  private async loadCities(stateCode: string) {
    if (!stateCode) { return; }

    try {
      const response: any = await firstValueFrom(this.utilsService.getCities(stateCode));
      this.cities.set(response);
    } catch {
      this.cities.set([]);
    }
  }

  private async loadStates() {
    try {
      const response: any = await firstValueFrom(this.utilsService.getStates());
      this.states.set(response);
    } catch { }
  }

  private async loadBillingData() {
    try {
      const response: any = await firstValueFrom(this.userService.getUserBillingData());
      this.billingData.set(response);

      if (response?.person_type) {
        this.billingForm.patchValue({
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
        this.citySearch.set(response.city ?? "");

        if (response.state) {
          await this.loadCities(response.state);
        }
      }
    } catch { }
  }

  async ngOnInit() {
    const queryStatus = this.route.snapshot.queryParamMap.get("status");
    if (queryStatus === "success") {
      await this.router.navigate([], { queryParams: {}, replaceUrl: true });
      Alert.success("", "Assinatura realizada com sucesso!");
    } else if (queryStatus === "cancel") {
      Alert.info("", "Assinatura cancelada.");
    }

    this.appState.loading.set(true);

    try {
      const [subResponse, planResponse]: any[] = await Promise.all([
        firstValueFrom(this.userService.getUserSubscription()),
        firstValueFrom(this.planService.getPlanList()),
      ]);
      this.subscription.set(subResponse);
      this.planList.set(planResponse.data);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }

    await Promise.all([
      this.loadStates(),
      this.loadBillingData(),
      this.loadInvoices(0),
    ]);
  }
}
