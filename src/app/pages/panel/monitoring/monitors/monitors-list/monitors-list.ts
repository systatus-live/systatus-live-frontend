import { Component, OnInit, inject, signal, computed } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucidePause, lucideClock, lucideBadgeCheck, lucideEllipsis, lucideCircleAlert } from "@ng-icons/lucide";
import { firstValueFrom } from "rxjs";
import { MonitorService } from "../../../../../services/monitor.service";
import { Alert } from "../../../../../lib/alert";
import { MonitorTypeLabelEnum } from "../../../../../types/monitor-type.enum";
import { HttpStatusCodeLabel, getHttpStatusKey } from "../../../../../types/http-status-code";
import { HlmButton } from "../../../../../components/button/src";
import { HlmInput } from "../../../../../components/input/src";
import { HlmBadgeImports } from "../../../../../components/badge/src";
import { HlmTableImports } from "../../../../../components/table/src";
import { HlmDropdownMenuImports } from "../../../../../components/dropdown-menu/src";
import { HlmTooltipImports } from "@spartan-ng/helm/tooltip";
import { AppTable } from "../../../../../components/app-table/app-table";
import { NavigatorState } from "../../../../../services/navigator-state";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { environment } from "../../../../../../environments/environment";

@Component({
  selector: "app-monitors-list",
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    HlmButton,
    HlmInput,
    ...HlmBadgeImports,
    ...HlmTableImports,
    ...HlmDropdownMenuImports,
    HlmTooltipImports,
    AppTable,
  ],
  providers: [
    provideIcons({ lucidePause, lucideClock, lucideBadgeCheck, lucideEllipsis, lucideCircleAlert }),
  ],
  templateUrl: "./monitors-list.html",
  styleUrl: "./monitors-list.scss",
})
export class MonitorsList implements OnInit {
  private readonly monitorService = inject(MonitorService);
  private readonly navigatorState = inject(NavigatorState);
  public readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  public readonly monitorList = signal<any[]>([]);
  private readonly page = signal(0);
  public readonly pagination = signal({ rows: 0, total: 0 });
  public readonly extras = signal<any>({});

  public readonly hasMore = computed(() => this.monitorList().length < this.pagination().total);

  private loadingMore = false;

  public readonly form = this.fb.group({
    search: [""],
  });

  async ngOnInit() {
    await this.fetchPage(0);
  }

  public getMonitorTypeLabel(type: string): string {
    return MonitorTypeLabelEnum[type as keyof typeof MonitorTypeLabelEnum] ?? type;
  }

  public getStatusLabel(monitor: any): string {
    if (monitor.lastStatus == null) {
      return "Pendente";
    }
    if (!monitor.active) {
      return "Pausado";
    }
    const label = HttpStatusCodeLabel[getHttpStatusKey(monitor.lastHttpStatus) as keyof typeof HttpStatusCodeLabel];
    return monitor.lastIncident ? `${label} • ${monitor.lastIncident}` : (label ?? monitor.lastHttpStatus);
  }

  public getStatusIcon(monitor: any): string {
    if (!monitor.active) {
      return "lucidePause";
    }
    if (monitor.lastStatus == null) {
      return "lucideClock";
    }
    return monitor.lastStatus === 'S' ? "lucideBadgeCheck" : "lucideCircleAlert";
  }

  public getStatusIconColor(monitor: any): string {
    if (!monitor.active || monitor.lastStatus == null) {
      return "text-gray-400";
    }
    return monitor.lastStatus === 'S' ? "text-[#05DF72]" : "text-[#FF6467]";
  }

  public getHistoricalStyle(item: any): string {
    if (item.percentOnline + item.percentOffline === 0) {
      return "background:#d1d5db";
    }
    if (item.percentOnline === 100) {
      return "background:#05DF72";
    }
    if (item.percentOnline >= 50) {
      return "background:#FDC700";
    }
    return "background:#FF6467";
  }

  public getFaviconUrl(address: string): string {
    return `${environment.apiUrl}/v1/utils/favicon?url=${encodeURIComponent(address)}`;
  }

  public hideFavicon(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img.src.endsWith("/images/globe.svg")) {
      img.src = "/images/globe.svg";
    }
  }

  public async copyAddress(address: string) {
    try {
      await navigator.clipboard.writeText(address);
      Alert.success("", "Copiado para área de transferência");
    } catch { }
  }

  public async fetchPage(p: number, search?: string) {
    const params = new URLSearchParams({ page: p.toString() });
    if (search) {
      params.set("search", search);
    }

    try {
      const response: any = await firstValueFrom(this.monitorService.getMonitorList(params));

      if (p === 0) {
        this.monitorList.set(response.data);
        this.navigatorState.set(response.data.map((m: any) => String(m.id)), "/panel/monitoring/monitors/view");
      } else {
        this.monitorList.update(prev => [...prev, ...response.data]);
        this.navigatorState.append(response.data.map((m: any) => String(m.id)));
      }

      this.pagination.set({ rows: response.pagination.rows, total: response.pagination.total });
      this.extras.set(response.extras ?? {});
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
    Alert.confirm("Excluir monitor", "O monitor será excluído permanentemente. Continuar?", async () => {
      try {
        const response: any = await firstValueFrom(
          this.monitorService.deleteMonitor(id),
        );

        await this.fetchPage(0, this.form.controls.search.value ?? "");

        Alert.success("", response.message);
      } catch (error: any) {
        Alert.error("", error.message);
      }
    });
  }

}
