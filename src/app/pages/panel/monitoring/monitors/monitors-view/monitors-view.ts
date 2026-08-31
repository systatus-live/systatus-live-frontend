import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef, PLATFORM_ID, inject, signal } from "@angular/core";
import { isPlatformBrowser, DatePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucidePencil, lucidePause, lucideClock, lucideCheck, lucideInfo } from "@ng-icons/lucide";
import { HlmTooltipImports } from "@spartan-ng/helm/tooltip";
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from "chart.js";
import { MonitorService } from "../../../../../services/monitor.service";
import { Alert } from "../../../../../lib/alert";
import { HttpStatusCodeLabel, getHttpStatusKey } from "../../../../../types/http-status-code";
import { MonitorTypeLabelEnum } from "../../../../../types/monitor-type.enum";
import { HlmButton } from "../../../../../components/button/src";
import { HlmBadgeImports } from "../../../../../components/badge/src";
import { HlmTableImports } from "../../../../../components/table/src";
import { AppTable } from "../../../../../components/app-table/app-table";

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

@Component({
  selector: "app-monitors-view",
  imports: [
    DatePipe,
    NgIcon,
    HlmButton,
    ...HlmBadgeImports,
    ...HlmTableImports,
    HlmTooltipImports,
    AppTable
  ],
  providers: [provideIcons({ lucidePencil, lucidePause, lucideClock, lucideCheck, lucideInfo })],
  templateUrl: "./monitors-view.html",
  styleUrl: "./monitors-view.scss",
})
export class MonitorsView implements OnInit, OnDestroy, AfterViewChecked {
  private readonly monitorService = inject(MonitorService);
  public readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild("responseTimeChart") responseTimeChartRef?: ElementRef<HTMLCanvasElement>;
  private responseTimeChart: Chart | null = null;
  private chartNeedsInit = false;

  public readonly monitor = signal<any>(null);
  public readonly lastCheck = signal<any>(null);
  public readonly historicalDays = signal<any[]>([]);
  public readonly percentOnline = signal(0);
  public readonly avgMetrics = signal<any>(null);
  public readonly recentIncidents = signal<any[]>([]);
  public readonly responseTime24h = signal<any[]>([]);

  public get waterfallPhases(): Array<{ label: string; hint: string; ms: number | null; color: string; widthPct: number }> {
    const lc = this.lastCheck();
    const total = lc?.lastDuration ?? 0;
    const hasData = lc != null && lc.lastTcp != null && lc.lastTtfb != null;

    const phases = [
      { label: "DNS", hint: "Tempo para resolver o domínio em endereço IP", ms: hasData ? (lc.lastDns ?? 0) : null, color: "#6366f1" },
      { label: "TCP", hint: "Tempo para estabelecer a conexão TCP com o servidor", ms: hasData ? (lc.lastTcp ?? 0) : null, color: "#0ea5e9" },
      { label: "TLS", hint: "Tempo do handshake SSL/TLS (apenas HTTPS)", ms: hasData ? (lc.lastTls ?? 0) : null, color: "#f59e0b" },
      { label: "TTFB", hint: "Tempo até o primeiro byte da resposta chegar", ms: hasData ? (lc.lastTtfb ?? 0) : null, color: "#10b981" }
    ];

    return phases.map(p => ({
      ...p,
      widthPct: hasData && total > 0 && p.ms != null ? Math.min(100, (p.ms / total) * 100) : 0
    }));
  }

  public getStatusLabel(status: string): string {
    return HttpStatusCodeLabel[getHttpStatusKey(status) as keyof typeof HttpStatusCodeLabel] ?? status ?? "—";
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

  public getMonitorTypeLabel(type: string): string {
    return MonitorTypeLabelEnum[type as keyof typeof MonitorTypeLabelEnum] ?? type;
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.router.navigate(["/panel/monitoring/monitors"]);
      return;
    }

    try {
      const [monitorRes, historicalRes]: any[] = await Promise.all([
        firstValueFrom(this.monitorService.getMonitorById(id)),
        firstValueFrom(this.monitorService.getMonitorHistorical(id)),
      ]);

      this.monitor.set(monitorRes);
      this.lastCheck.set(historicalRes.lastCheck);
      this.historicalDays.set(historicalRes.historicalDays ?? []);
      this.percentOnline.set(historicalRes.percentOnline ?? 0);
      this.avgMetrics.set(historicalRes.avgMetrics ?? null);
      this.recentIncidents.set(historicalRes.recentIncidents ?? []);
      this.responseTime24h.set(historicalRes.responseTime24h ?? []);
      this.chartNeedsInit = true;
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }

  ngOnDestroy() {
    this.responseTimeChart?.destroy();
  }

  ngAfterViewChecked() {
    if (this.chartNeedsInit && this.responseTimeChartRef) {
      this.chartNeedsInit = false;
      this.initResponseTimeChart();
    }
  }

  private initResponseTimeChart() {
    if (!isPlatformBrowser(this.platformId) || !this.responseTimeChartRef) {
      return;
    }

    const data = this.responseTime24h();

    if (this.responseTimeChart) {
      this.responseTimeChart.destroy();
    }

    this.responseTimeChart = new Chart(this.responseTimeChartRef.nativeElement, {
      type: "line",
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.avgTotal),
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y ?? 0}ms`
            }
          }
        },
        scales: {
          x: {
            display: true,
            ticks: {
              font: { size: 10 },
              color: "#888",
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8
            },
            grid: { display: false }
          },
          y: {
            display: true,
            min: 0,
            ticks: {
              font: { size: 10 },
              color: "#888",
              callback: (value) => `${value}ms`
            },
            grid: { color: "rgba(0,0,0,0.05)" }
          }
        }
      }
    });
  }

}
