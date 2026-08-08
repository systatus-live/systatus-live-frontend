import { Component, OnInit, OnDestroy, inject, signal, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
  lucideBadgeCheck,
  lucideClock,
  lucideCircleAlert,
  lucideAlertTriangle,
  lucideInfo,
} from "@ng-icons/lucide";
import { environment } from "../../../environments/environment";
import { StatusPage as StatusPageService } from "../../services/status-page";
import { HttpStatusCodeLabel, getHttpStatusKey } from "../../types/http-status-code";
import { LogoComponent } from "../../components/logo/logo.component";
import { HlmTooltipImports } from "@spartan-ng/helm/tooltip";

const REFRESH_INTERVAL = 60;

@Component({
  selector: "app-status-public",
  imports: [
    RouterLink, 
    NgIcon, 
    LogoComponent,
    HlmTooltipImports
  ],
  providers: [
    provideIcons({
      lucideBadgeCheck,
      lucideClock,
      lucideCircleAlert,
      lucideAlertTriangle,
      lucideInfo,
    }),
  ],
  templateUrl: "./status-public.html",
  styleUrl: "./status-public.scss",
})
export class StatusPublic implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly statusPageService = inject(StatusPageService);
  private readonly platformId = inject(PLATFORM_ID);

  public readonly data = signal<any>(null);
  public readonly notFound = signal(false);
  public readonly lastUpdated = signal<Date | null>(null);
  public readonly countdown = signal(REFRESH_INTERVAL);

  private intervalId: any = null;

  private get slug(): string {
    return this.route.snapshot.paramMap.get("slug") ?? "";
  }

  public get overallStatus(): "operational" | "partial" | "outage" | "empty" {
    const monitors = this.data()?.monitors ?? [];
    if (monitors.length === 0) {
      return "empty";
    }

    const withStatus = monitors.filter((m: any) => m.lastStatus !== null);
    if (withStatus.length === 0) {
      return "empty";
    }

    const down = withStatus.filter((m: any) => !m.lastStatus.startsWith("2"));
    if (down.length === 0) {
      return "operational";
    }

    if (down.length < withStatus.length) {
      return "partial";
    }

    return "outage";
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

  public getStatusLabel(monitor: any): string | null {
    if (monitor.lastStatus === null) {
      return null;
    }
    const label = HttpStatusCodeLabel[getHttpStatusKey(monitor.lastStatus) as keyof typeof HttpStatusCodeLabel];
    return monitor.lastIncident ? `${label} a ${monitor.lastIncident} • Latência: ${monitor.lastDuration}ms` : label;
  }

  private async fetchData() {
    try {
      const response: any = await firstValueFrom(this.statusPageService.getPublicStatusPage(this.slug));
      this.data.set(response);
      this.lastUpdated.set(new Date());
      this.countdown.set(REFRESH_INTERVAL);
    } catch (error: any) {
      if (error?.status === 404) {
        this.notFound.set(true);
        this.stopTimer();
      }
    }
  }

  private startTimer() {
    this.intervalId = setInterval(() => {
      this.countdown.update(c => {
        if (c <= 1) {
          this.fetchData();
          return REFRESH_INTERVAL;
        }
        return c - 1;
      });
    }, 1000);
  }

  private stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async ngOnInit() {
    await this.fetchData();

    if (isPlatformBrowser(this.platformId) && !this.notFound()) {
      this.startTimer();
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
