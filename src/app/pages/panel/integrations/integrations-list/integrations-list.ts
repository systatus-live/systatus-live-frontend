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
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { HlmInput } from "../../../../components/input/src";
import { HlmTooltipImports } from "@spartan-ng/helm/tooltip";

@Component({
  selector: "app-integrations-list",
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    HlmButton,
    HlmInput,
    ...HlmTableImports,
    ...HlmDropdownMenuImports,
    HlmTooltipImports
  ],
  providers: [provideIcons({ lucideEllipsis })],
  templateUrl: "./integrations-list.html",
  styleUrl: "./integrations-list.scss",
})
export class IntegrationsList implements OnInit {
  private readonly appState = inject(AppStateService);
  private readonly integrationService = inject(Integration);
  public readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  public readonly integrationList = signal<any[]>([]);
  public readonly page = signal(0);
  public readonly pagination = signal({ rows: 0, total: 0 });

  public readonly form = this.fb.group({
    search: [""],
  });

  async ngOnInit() {
    this.appState.loading.set(true);

    try {
      const response: any = await firstValueFrom(
        this.integrationService.getIntegrationList(new URLSearchParams({ page: "0" })),
      );

      this.integrationList.set(response.data);
      this.pagination.set({ rows: response.pagination.rows, total: response.pagination.total });
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }

  public get totalPages(): number {
    const { rows, total } = this.pagination();
    return rows > 0 ? Math.ceil(total / rows) : 1;
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

  public async fetchPage(p: number, search?: string) {
    this.appState.loading.set(true);

    const params = new URLSearchParams({ page: p.toString() });
    if (search) {
      params.set("search", search);
    }

    try {
      const response: any = await firstValueFrom(this.integrationService.getIntegrationList(params));
      this.integrationList.set(response.data);
      this.pagination.set({ rows: response.pagination.rows, total: response.pagination.total });
      this.page.set(p);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }

  public async onSubmitSearch() {
    await this.fetchPage(0, this.form.controls.search.value ?? "");
  }
}
