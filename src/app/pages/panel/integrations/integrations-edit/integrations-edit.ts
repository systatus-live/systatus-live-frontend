import { Component, OnInit, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { firstValueFrom } from "rxjs";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucidePencil } from "@ng-icons/lucide";
import { AppStateService } from "../../../../state/app-state.service";
import { Integration } from "../../../../services/integration";
import { ChatPlatform } from "../../../../services/chat-platform";
import { Alert } from "../../../../lib/alert";
import { ChatPlatformNameLogoMap, ChatPlatformTypeEnum } from "../../../../types/chat-platform.enum";
import { HlmButton } from "../../../../components/button/src";
import { HlmInput } from "../../../../components/input/src";
import { HlmLabel } from "../../../../components/label/src";
import { HlmSelectImports } from "../../../../components/select/src";
import { HlmSeparatorImports } from "../../../../components/separator/src";
import { WebhookTutorial } from "../components/webhook-tutorial/webhook-tutorial";

@Component({
  selector: "app-integrations-edit",
  imports: [
    ReactiveFormsModule,
    NgIcon,
    HlmButton,
    HlmInput,
    HlmLabel,
    ...HlmSelectImports,
    ...HlmSeparatorImports,
    WebhookTutorial,
  ],
  providers: [provideIcons({ lucidePencil })],
  templateUrl: "./integrations-edit.html",
  styleUrl: "./integrations-edit.scss",
})
export class IntegrationsEdit implements OnInit {
  private readonly appState = inject(AppStateService);
  private readonly integrationService = inject(Integration);
  private readonly chatPlatformService = inject(ChatPlatform);
  public readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  public readonly platformList = signal<any[]>([]);
  public readonly integration = signal<any>(null);
  public readonly isEditing = signal(false);

  public getPlatformLogo(platformName: string): string {
    return ChatPlatformNameLogoMap[platformName] ?? "/logos/mail.svg";
  }

  public readonly form = this.fb.group({
    name: ["", [Validators.required, Validators.maxLength(128)]],
    chatPlatformId: ["", Validators.required],
    address: ["", [Validators.required, Validators.maxLength(1000)]],
  });

  public readonly platformItemToString = (id: string) =>
    this.platformList().find(p => p.id === id)?.description ?? id;

  private get id(): string {
    return this.route.snapshot.paramMap.get("id") ?? "";
  }

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
    this.appState.loading.set(true);

    try {
      const [platformRes, integrationRes]: any[] = await Promise.all([
        firstValueFrom(this.chatPlatformService.getChatPlatformList(new URLSearchParams({ page: "0" }))),
        firstValueFrom(this.integrationService.getIntegrationById(this.id)),
      ]);

      this.platformList.set(platformRes.data);
      this.integration.set(integrationRes);

      this.patchForm(integrationRes);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }

  public async handleValidate() {
    this.appState.loading.set(true);

    try {
      const response: any = await firstValueFrom(this.integrationService.validateIntegration(this.id));
      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }

  public handleDelete() {
    Alert.confirm("Excluir integração", "A integração será excluída permanentemente. Continuar?", async () => {
      this.appState.loading.set(true);

      try {
        const response: any = await firstValueFrom(this.integrationService.deleteIntegration(this.id));
        this.router.navigate(["/panel/integrations"]);
        Alert.success("", response.message);
      } catch (error: any) {
        Alert.error("", error.message);
      } finally {
        this.appState.loading.set(false);
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
    });
  }

  public async handleSave() {
    if (this.form.invalid) {
      return;
    }

    this.appState.loading.set(true);

    try {
      const response: any = await firstValueFrom(
        this.integrationService.updateIntegration(this.id, {
          chatPlatformId: this.form.controls.chatPlatformId.value,
          name: this.form.controls.name.value,
          address: this.form.controls.address.value,
        }),
      );

      this.integration.set({
        ...this.integration(),
        name: this.form.controls.name.value,
        chat_platform_id: this.form.controls.chatPlatformId.value,
        address: this.form.controls.address.value,
      });

      Alert.success("", response.message);
      this.isEditing.set(false);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }
}
