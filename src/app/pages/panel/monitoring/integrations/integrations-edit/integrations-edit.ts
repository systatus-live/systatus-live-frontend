import { Component, OnInit, OnDestroy, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucidePencil, lucideCheck, lucideRefreshCcw, lucideList, lucideTrash2 } from "@ng-icons/lucide";
import { HlmTooltipImports } from "@spartan-ng/helm/tooltip";
import { firstValueFrom, Subscription } from "rxjs";
import { map, filter, distinctUntilChanged } from "rxjs/operators";
import { HlmButton } from "../../../../../components/button/src";
import { HlmInput } from "../../../../../components/input/src";
import { HlmLabel } from "../../../../../components/label/src";
import { HlmSelectImports } from "../../../../../components/select/src";
import { HlmSeparatorImports } from "../../../../../components/separator/src";
import { HlmTextarea } from "../../../../../components/textarea/src";
import { Alert } from "../../../../../lib/alert";
import { ChatPlatform } from "../../../../../services/chat-platform.service";
import { Integration } from "../../../../../services/integration.service";
import { AppStateService } from "../../../../../state/app-state.service";
import { ChatPlatformTypeEnum } from "../../../../../types/chat-platform.enum";
import { PermissionEnum } from "../../../../../types/permission.enum";
import { WebhookTutorial } from "../components/webhook-tutorial/webhook-tutorial";
import { HlmSkeleton } from "../../../../../components/skeleton/src";
import { AppNavigator } from "../../../../../components/app-navigator/app-navigator";

@Component({
  selector: "app-integrations-edit",
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    HlmButton,
    HlmInput,
    HlmLabel,
    HlmTextarea,
    ...HlmSelectImports,
    ...HlmSeparatorImports,
    WebhookTutorial,
    HlmTooltipImports,
    HlmSkeleton,
    AppNavigator,
  ],
  providers: [provideIcons({ lucidePencil, lucideCheck, lucideRefreshCcw, lucideList, lucideTrash2 })],
  templateUrl: "./integrations-edit.html",
  styleUrl: "./integrations-edit.scss",
})
export class IntegrationsEdit implements OnInit, OnDestroy {
  private readonly integrationService = inject(Integration);
  private readonly chatPlatformService = inject(ChatPlatform);
  private readonly appState = inject(AppStateService);
  public readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  private routeSub: Subscription | null = null;
  private routeId = "";

  public readonly platformList = signal<any[]>([]);
  public readonly integration = signal<any>(null);
  public readonly isEditing = signal(false);
  public readonly templateDefaults = signal<{ downTemplate: string; upTemplate: string } | null>(null);
  public lastFocused: { el: HTMLTextAreaElement; controlName: "downTemplate" | "upTemplate" } | null = null;

  public readonly reservedWords = [
    { label: "{{monitor}}", description: "Nome do monitor" },
    { label: "{{address}}", description: "Endereço monitorado" },
    { label: "{{status_code}}", description: "Código de status" },
    { label: "{{status_description}}", description: "Descrição do status" },
    { label: "{{downtime}}", description: "Tempo indisponível" },
    { label: "{{datetime}}", description: "Data e hora do monitor" },
  ];

  public get hasCustomNotification(): boolean {
    return this.appState.permissionList().includes(PermissionEnum.CUSTOM_NOTIFICATION);
  }

  public insertWord(word: string): void {
    const focused = this.lastFocused;
    if (!focused) return;
    const el = focused.el;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const newValue = el.value.substring(0, start) + word + el.value.substring(end);
    this.form.controls[focused.controlName].setValue(newValue);
    setTimeout(() => {
      el.selectionStart = start + word.length;
      el.selectionEnd = start + word.length;
      el.focus();
    }, 0);
  }

  public resetTemplates(): void {
    this.form.patchValue({
      downTemplate: this.templateDefaults()?.downTemplate ?? "",
      upTemplate: this.templateDefaults()?.upTemplate ?? "",
    });
  }

  public readonly form = this.fb.group({
    name: ["", [Validators.required, Validators.maxLength(128)]],
    chatPlatformId: ["", Validators.required],
    address: ["", [Validators.required, Validators.maxLength(1000)]],
    downTemplate: ["", Validators.maxLength(250)],
    upTemplate: ["", Validators.maxLength(250)],
  });

  public readonly platformItemToString = (id: string) =>
    this.platformList().find(p => p.id === id)?.description ?? id;

  public get selectedPlatform(): any {
    const id = this.form.controls.chatPlatformId.value;
    return this.platformList().find(p => p.id === id) ?? null;
  }

  public get addressLabel(): string {
    const platform = this.selectedPlatform;
    if (!platform) {
      return "URL Webhook";
    }
    switch (platform.type) {
      case ChatPlatformTypeEnum.EMAIL:
        return "E-mail";
      case ChatPlatformTypeEnum.PHONE:
        return "WhatsApp (DDD + 9 dígitos)";
      default:
        return "URL Webhook";
    }
  }

  public get addressPlaceholder(): string {
    const platform = this.selectedPlatform;
    if (!platform) {
      return "";
    }
    switch (platform.type) {
      case ChatPlatformTypeEnum.EMAIL:
        return "destinatario@email.com";
      case ChatPlatformTypeEnum.PHONE:
        return "WhatsApp (com DDD)";
      default:
        return "https://hooks.example.com/...";
    }
  }

  public get isWebhookType(): boolean {
    return this.selectedPlatform?.type === ChatPlatformTypeEnum.WEBHOOK;
  }

  ngOnInit() {
    this.routeSub = this.route.paramMap.pipe(
      map(params => params.get("id")),
      filter(id => !!id),
      distinctUntilChanged(),
    ).subscribe(id => {
      this.routeId = id!;
      this.loadData(id!);
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  private async loadData(id: string) {
    this.integration.set(null);
    this.isEditing.set(false);

    try {
      const [platformRes, integrationRes, defaultsRes]: any[] = await Promise.all([
        firstValueFrom(this.chatPlatformService.getChatPlatformList(new URLSearchParams({ page: "0" }))),
        firstValueFrom(this.integrationService.getIntegrationById(id)),
        firstValueFrom(this.integrationService.getTemplateDefaults()),
      ]);

      this.platformList.set(platformRes.data);
      this.integration.set(integrationRes);
      this.templateDefaults.set(defaultsRes);

      this.patchForm(integrationRes);
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }

  public async handleValidate() {
    try {
      const response: any = await firstValueFrom(this.integrationService.validateIntegration(this.routeId));
      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }

  public handleDelete() {
    Alert.confirm("Excluir integração", "A integração será excluída permanentemente. Continuar?", async () => {
      try {
        const response: any = await firstValueFrom(this.integrationService.deleteIntegration(this.routeId));
        this.router.navigate(["/panel/monitoring/integrations"]);
        Alert.success("", response.message);
      } catch (error: any) {
        Alert.error("", error.message);
      }
    });
  }

  public handleCancel() {
    this.patchForm(this.integration());
    this.isEditing.set(false);
  }

  private patchForm(integration: any) {
    this.form.patchValue({
      name: integration.name,
      chatPlatformId: integration.chat_platform_id,
      address: integration.address,
      downTemplate: integration.template?.down_template ?? this.templateDefaults()?.downTemplate ?? "",
      upTemplate: integration.template?.up_template ?? this.templateDefaults()?.upTemplate ?? "",
    });
  }

  public async handleSave() {
    if (this.form.invalid) {
      return;
    }

    try {
      const response: any = await firstValueFrom(
        this.integrationService.updateIntegration(this.routeId, {
          chatPlatformId: this.form.controls.chatPlatformId.value,
          name: this.form.controls.name.value,
          address: this.form.controls.address.value,
          ...(this.isWebhookType && this.hasCustomNotification ? {
            downTemplate: this.form.controls.downTemplate.value || null,
            upTemplate: this.form.controls.upTemplate.value || null,
          } : {}),
        }),
      );

      this.integration.set({
        ...this.integration(),
        name: this.form.controls.name.value,
        chat_platform_id: this.form.controls.chatPlatformId.value,
        address: this.form.controls.address.value,
        template: {
          down_template: this.form.controls.downTemplate.value || null,
          up_template: this.form.controls.upTemplate.value || null,
        },
      });

      Alert.success("", response.message);
      this.isEditing.set(false);
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }
}
