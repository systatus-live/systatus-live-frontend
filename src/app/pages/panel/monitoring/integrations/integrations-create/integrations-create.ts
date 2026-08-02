import { Component, OnInit, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { firstValueFrom } from "rxjs";
import { Integration } from "../../../../../services/integration";
import { ChatPlatform } from "../../../../../services/chat-platform";
import { Alert } from "../../../../../lib/alert";
import { ChatPlatformNameLogoMap, ChatPlatformTypeEnum } from "../../../../../types/chat-platform.enum";
import { HlmButton } from "../../../../../components/button/src";
import { HlmInput } from "../../../../../components/input/src";
import { HlmLabel } from "../../../../../components/label/src";
import { HlmSelectImports } from "../../../../../components/select/src";
import { WebhookTutorial } from "../components/webhook-tutorial/webhook-tutorial";

@Component({
  selector: "app-integrations-create",
  imports: [
    ReactiveFormsModule,
    HlmButton,
    HlmInput,
    HlmLabel,
    ...HlmSelectImports,
    WebhookTutorial,
  ],
  templateUrl: "./integrations-create.html",
  styleUrl: "./integrations-create.scss",
})
export class IntegrationsCreate implements OnInit {
  private readonly integrationService = inject(Integration);
  private readonly chatPlatformService = inject(ChatPlatform);
  public readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  public readonly platformList = signal<any[]>([]);

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
      const response: any = await firstValueFrom(
        this.chatPlatformService.getChatPlatformList(new URLSearchParams({ page: "0" })),
      );

      this.platformList.set(response.data);
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
        }),
      );

      Alert.success("", response.message);
      this.router.navigate(["/panel/monitoring/integrations/edit", response.data.id]);
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }
}
