import { Component, OnInit, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideEllipsis } from "@ng-icons/lucide";
import { AppStateService } from "../../../../state/app-state.service";
import { Integration } from "../../../../services/integration";
import { Alert } from "../../../../lib/alert";
import { ChatPlatformDescriptionLogoMap } from "../../../../types/chat-platform.enum";
import { HlmButton } from "../../../../components/button/src";
import { HlmTableImports } from "../../../../components/table/src";
import { HlmDropdownMenuImports } from "../../../../components/dropdown-menu/src";

@Component({
  selector: "app-integrations-list",
  imports: [
    RouterLink,
    NgIcon,
    HlmButton,
    ...HlmTableImports,
    ...HlmDropdownMenuImports,
  ],
  providers: [provideIcons({ lucideEllipsis })],
  templateUrl: "./integrations-list.html",
  styleUrl: "./integrations-list.scss",
})
export class IntegrationsList implements OnInit {
  private readonly appState = inject(AppStateService);
  private readonly integrationService = inject(Integration);
  public readonly router = inject(Router);

  public readonly integrationList = signal<any[]>([]);

  async ngOnInit() {
    this.appState.loading.set(true);

    try {
      const response: any = await firstValueFrom(
        this.integrationService.getIntegrationList(new URLSearchParams({ page: "0" })),
      );

      this.integrationList.set(response.data);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }

  public async handleValidate(id: string) {
    this.appState.loading.set(true);

    try {
      const response: any = await firstValueFrom(this.integrationService.validateIntegration(id));
      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }

  public getPlatformLogo(chatPlatform: string): string {
    return ChatPlatformDescriptionLogoMap[chatPlatform] ?? "/logos/mail.svg";
  }

  public async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      Alert.success("", "Copiado para área de transferência");
    } catch { }
  }
}
