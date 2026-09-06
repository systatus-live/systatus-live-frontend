import { Component, OnInit, inject, signal, computed } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideEllipsis } from "@ng-icons/lucide";
import { Integration } from "../../../../../services/integration.service";
import { Alert } from "../../../../../lib/alert";
import { NavigatorState } from "../../../../../services/navigator-state";
import { HlmButton } from "../../../../../components/button/src";
import { HlmTableImports } from "../../../../../components/table/src";
import { HlmDropdownMenuImports } from "../../../../../components/dropdown-menu/src";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { HlmInput } from "../../../../../components/input/src";
import { HlmTooltipImports } from "@spartan-ng/helm/tooltip";
import { AppTable } from "../../../../../components/app-table/app-table";

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
    HlmTooltipImports,
    AppTable,
  ],
  providers: [provideIcons({ lucideEllipsis })],
  templateUrl: "./integrations-list.html",
  styleUrl: "./integrations-list.scss",
})
export class IntegrationsList implements OnInit {
  private readonly integrationService = inject(Integration);
  private readonly navigatorState = inject(NavigatorState);
  public readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  public readonly integrationList = signal<any[]>([]);
  private readonly page = signal(0);
  public readonly pagination = signal({ rows: 0, total: 0 });

  public readonly hasMore = computed(() => this.integrationList().length < this.pagination().total);

  private loadingMore = false;

  public readonly form = this.fb.group({
    search: [""],
  });

  async ngOnInit() {
    await this.fetchPage(0);
  }

  public async handleValidate(id: string) {
    try {
      const response: any = await firstValueFrom(this.integrationService.validateIntegration(id));
      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }

  public async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      Alert.success("", "Copiado para área de transferência");
    } catch { }
  }

  public async fetchPage(p: number, search?: string) {
    const params = new URLSearchParams({ page: p.toString() });
    if (search) {
      params.set("search", search);
    }

    try {
      const response: any = await firstValueFrom(this.integrationService.getIntegrationList(params));

      if (p === 0) {
        this.integrationList.set(response.data);
        this.navigatorState.set(response.data.map((i: any) => String(i.id)), "/panel/monitoring/integrations/edit");
      } else {
        this.integrationList.update(prev => [...prev, ...response.data]);
        this.navigatorState.append(response.data.map((i: any) => String(i.id)));
      }

      this.pagination.set({ rows: response.pagination.rows, total: response.pagination.total });
      this.page.set(p);
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }

  public async onLoadMore() {
    if (this.loadingMore || !this.hasMore()) {
      return;
    }
    this.loadingMore = true;
    await this.fetchPage(this.page() + 1, this.form.controls.search.value ?? "");
    this.loadingMore = false;
  }

  public async onSubmitSearch() {
    await this.fetchPage(0, this.form.controls.search.value ?? "");
  }

  public handleDelete(id: string) {
    Alert.confirm("Excluir integração", "A integração será excluída permanentemente. Continuar?", async () => {
      try {
        const response: any = await firstValueFrom(this.integrationService.deleteIntegration(id));

        await this.fetchPage(0, this.form.controls.search.value ?? "");

        Alert.success("", response.message);
      } catch (error: any) {
        Alert.error("", error.message);
      }
    });
  }
}
