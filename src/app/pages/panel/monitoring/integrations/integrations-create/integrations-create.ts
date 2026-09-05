import { Component, OnInit, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { HlmTooltipImports } from "@spartan-ng/helm/tooltip";
import { firstValueFrom } from "rxjs";
import { HlmButton } from "../../../../../components/button/src";
import { HlmInput } from "../../../../../components/input/src";
import { HlmLabel } from "../../../../../components/label/src";
import { HlmSelectImports } from "../../../../../components/select/src";
import { HlmTextarea } from "../../../../../components/textarea/src";
import { Alert } from "../../../../../lib/alert";
import { ChatPlatform } from "../../../../../services/chat-platform.service";
import { Integration } from "../../../../../services/integration.service";
import { AppStateService } from "../../../../../state/app-state.service";
import { ChatPlatformNameLogoMap, ChatPlatformTypeEnum } from "../../../../../types/chat-platform.enum";
import { PermissionEnum } from "../../../../../types/permission.enum";
import { WebhookTutorial } from "../components/webhook-tutorial/webhook-tutorial";

@Component({
  selector: "app-integrations-create",
  imports: [
    ReactiveFormsModule,
    RouterLink,
    HlmButton,
    HlmInput,
    HlmLabel,
    HlmTextarea,
    ...HlmSelectImports,
    WebhookTutorial,
    HlmTooltipImports
  ],
  templateUrl: "./integrations-create.html",
  styleUrl: "./integrations-create.scss",
})
export class IntegrationsCreate implements OnInit {
  private readonly integrationService = inject(Integration);
  private readonly chatPlatformService = inject(ChatPlatform);
  private readonly appState = inject(AppStateService);
  public readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  public readonly platformList = signal<any[]>([]);
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

  public getPlatformLogo(platformName: string): string {
    return ChatPlatformNameLogoMap[platformName] ?? "/logos/mail.svg";
  }

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
        return "Telefone";
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

  async ngOnInit() {
    try {
      const [platformRes, defaultsRes]: any[] = await Promise.all([
        firstValueFrom(this.chatPlatformService.getChatPlatformList(new URLSearchParams({ page: "0" }))),
        firstValueFrom(this.integrationService.getTemplateDefaults()),
      ]);

      this.platformList.set(platformRes.data);
      this.templateDefaults.set(defaultsRes);
      
      this.form.patchValue({
        downTemplate: defaultsRes.downTemplate,
        upTemplate: defaultsRes.upTemplate,
      });
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }

  public async handleSave() {
    if (this.form.invalid) {
      return;
    }

    try {
      const response: any = await firstValueFrom(
        this.integrationService.createIntegration({
          chatPlatformId: this.form.controls.chatPlatformId.value,
          name: this.form.controls.name.value,
          address: this.form.controls.address.value,
          ...(this.isWebhookType && this.hasCustomNotification ? {
            downTemplate: this.form.controls.downTemplate.value || null,
            upTemplate: this.form.controls.upTemplate.value || null,
          } : {}),
        }),
      );

      Alert.success("", response.message);
      this.router.navigate(["/panel/monitoring/integrations/edit", response.data.id]);
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }
}
