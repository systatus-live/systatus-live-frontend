import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject, signal, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser, DatePipe } from "@angular/common";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from "chart.js";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideCheck } from "@ng-icons/lucide";
import { Incident } from "../../../../../services/incident.service";
import { Alert } from "../../../../../lib/alert";
import { HttpStatusCodeLabel, getHttpStatusKey } from "../../../../../types/http-status-code";
import { HlmButton } from "../../../../../components/button/src";
import { HlmInput } from "../../../../../components/input/src";
import { HlmBadgeImports } from "../../../../../components/badge/src";
import { HlmTableImports } from "../../../../../components/table/src";
import { AppTable } from "../../../../../components/app-table/app-table";

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

@Component({
  selector: "app-incidents-list",
  imports: [
    ReactiveFormsModule,
    DatePipe,
    NgIcon,
    HlmButton,
    HlmInput,
    ...HlmBadgeImports,
    ...HlmTableImports,
    AppTable,
  ],
  providers: [provideIcons({ lucideCheck })],
  templateUrl: "./incidents-list.html",
  styleUrl: "./incidents-list.scss",
})
export class IncidentsList implements OnInit, OnDestroy {
  private readonly incidentService = inject(Incident);
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  public readonly router = inject(Router);

  public readonly isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild("chartCanvas", { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  public readonly historical = signal<any[]>([]);
  public readonly incidentList = signal<any[]>([]);
  public readonly extras = signal<any>({});
  public readonly page = signal(0);
  public readonly pagination = signal({ rows: 0, total: 0 });

  public readonly form = this.fb.group({
    search: [""],
  });

  public get totalPages(): number {
    const { rows, total } = this.pagination();
    return rows > 0 ? Math.ceil(total / rows) : 1;
  }

  async ngOnInit() {
    try {
      const [historicalRes, incidentRes]: any[] = await Promise.all([
        firstValueFrom(this.incidentService.getHistorical()),
        firstValueFrom(this.incidentService.getIncidentList(new URLSearchParams({ page: "0" }))),
      ]);

      this.historical.set(historicalRes.data);
      this.incidentList.set(incidentRes.data);
      this.pagination.set({ rows: incidentRes.pagination.rows, total: incidentRes.pagination.total });
      this.extras.set(incidentRes.extras);

      this.initChart();
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private initChart() {
    if (!this.isBrowser || !this.chartCanvas) {
      return;
    }

    const data = this.historical();
    if (data.length === 0) {
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: "line",
      data: {
        labels: data.map(d => {
          const parts = String(d.date).split("-");
          return parts.length === 3 ? `${parts[2]}/${parts[1]}` : d.date;
        }),
        datasets: [{
          data: data.map(d => Number(d.total)),
          borderColor: "#FDC700",
          backgroundColor: "rgba(253, 199, 0, 0.15)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: data.map(d => Number(d.total) > 0 ? 3 : 0) as any,
          pointBackgroundColor: "#FDC700",
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => items[0].label,
              label: (ctx) => ` ${ctx.parsed.y} incidentes`,
            },
          },
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
            suggestedMax: 1,
            ticks: {
              font: { size: 10 },
              color: "#888",
              precision: 0
            },
            grid: { color: "rgba(0,0,0,0.05)" }
          },
        },
      },
      plugins: [],
    });
  }

  public async fetchPage(p: number, search?: string) {
    const params = new URLSearchParams({ page: p.toString() });
    if (search) {
      params.set("search", search);
    }

    try {
      const response: any = await firstValueFrom(this.incidentService.getIncidentList(params));
      this.incidentList.set(response.data);
      this.pagination.set({ rows: response.pagination.rows, total: response.pagination.total });
      this.page.set(p);
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }

  public async onSubmitSearch() {
    await this.fetchPage(0, this.form.controls.search.value ?? "");
  }

  public getStatusLabel(status: string): string {
    return HttpStatusCodeLabel[getHttpStatusKey(status) as keyof typeof HttpStatusCodeLabel] ?? status;
  }
}
