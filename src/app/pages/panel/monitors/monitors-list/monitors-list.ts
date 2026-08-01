import { Component, OnInit, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucidePause, lucideClock, lucideBadgeCheck, lucideEllipsis, lucideCircleAlert } from "@ng-icons/lucide";
import { firstValueFrom } from "rxjs";
import { AppStateService } from "../../../../state/app-state.service";
import { MonitorService } from "../../../../services/monitor.service";
import { Alert } from "../../../../lib/alert";
import { MonitorTypeLabelEnum } from "../../../../types/monitor-type.enum";
import { HttpStatusCodeLabel, getHttpStatusKey } from "../../../../types/http-status-code";
import { HlmButton } from "../../../../components/button/src";
import { HlmBadgeImports } from "../../../../components/badge/src";
import { HlmTableImports } from "../../../../components/table/src";
import { HlmDropdownMenuImports } from "../../../../components/dropdown-menu/src";
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
  selector: "app-monitors-list",
  imports: [
    RouterLink,
    NgIcon,
    HlmButton,
    ...HlmBadgeImports,
    ...HlmTableImports,
    ...HlmDropdownMenuImports,
    HlmTooltipImports
  ],
  providers: [
    provideIcons({ lucidePause, lucideClock, lucideBadgeCheck, lucideEllipsis, lucideCircleAlert }),
  ],
  templateUrl: "./monitors-list.html",
  styleUrl: "./monitors-list.scss",
})
export class MonitorsList implements OnInit {
  private readonly monitorService = inject(MonitorService);
  private readonly appState = inject(AppStateService);
  public readonly router = inject(Router);

  public readonly monitorList = signal<any[]>([]);

  public getMonitorTypeLabel(type: string): string {
    return MonitorTypeLabelEnum[type as keyof typeof MonitorTypeLabelEnum] ?? type;
  }

  async ngOnInit() {
    this.appState.loading.set(true);
    try {
      const response: any = await firstValueFrom(
        this.monitorService.getMonitorList(new URLSearchParams({ page: "0" })),
      );
      this.monitorList.set(response.data);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }

  public getFaviconUrl(address: string): string {
    try {
      const url = new URL(address);
      return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=16`;
    } catch {
      return "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=16";
    }
  }

  public getStatusLabel(monitor: any): string {
    if (monitor.lastStatus == null) {
      return "Pendente";
    }
    if (!monitor.active) {
      return "Pausado";
    }
    const label = HttpStatusCodeLabel[getHttpStatusKey(monitor.lastStatus) as keyof typeof HttpStatusCodeLabel];
    return monitor.lastIncident ? `${label} ${monitor.lastIncident}` : (label ?? monitor.lastStatus);
  }

  public getStatusIcon(monitor: any): string {
    if (!monitor.active) {
      return "lucidePause";
    }
    if (monitor.lastStatus == null) {
      return "lucideClock";
    }
    return monitor.lastStatus?.startsWith("2") ? "lucideBadgeCheck" : "lucideCircleAlert";
  }

  public getStatusIconColor(monitor: any): string {
    if (!monitor.active || monitor.lastStatus == null) {
      return "text-gray-400";
    }
    return monitor.lastStatus?.startsWith("2") ? "text-[#05DF72]" : "text-[#FF6467]";
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

  public hideFavicon(event: Event) {
    (event.target as HTMLImageElement).style.display = "none";
  }

  public async copyAddress(address: string) {
    try {
      await navigator.clipboard.writeText(address);
      Alert.success("", "Copiado para área de transferência");
    } catch { }
  }
}
