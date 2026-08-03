import { Component, OnInit, inject, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideCheck } from "@ng-icons/lucide";
import { Incident } from "../../../../../services/incident";
import { Alert } from "../../../../../lib/alert";
import { HttpStatusCodeLabel, getHttpStatusKey } from "../../../../../types/http-status-code";
import { MonitorTypeLabelEnum } from "../../../../../types/monitor-type.enum";
import { HlmButton } from "../../../../../components/button/src";
import { HlmBadgeImports } from "../../../../../components/badge/src";
import { HlmTableImports } from "../../../../../components/table/src";

@Component({
  selector: "app-incidents-view",
  imports: [
    DatePipe,
    NgIcon,
    HlmButton,
    ...HlmBadgeImports,
    ...HlmTableImports,
  ],
  providers: [provideIcons({ lucideCheck })],
  templateUrl: "./incidents-view.html",
  styleUrl: "./incidents-view.scss",
})
export class IncidentsView implements OnInit {
  private readonly incidentService = inject(Incident);
  public readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly incident = signal<any>(null);
  public readonly historicalItems = signal<any[]>([]);
  public readonly historicalPage = signal(0);
  public readonly historicalPagination = signal({ rows: 0, total: 0 });

  public get historicalTotalPages(): number {
    const { rows, total } = this.historicalPagination();
    return rows > 0 ? Math.ceil(total / rows) : 1;
  }

  public getStatusLabel(status: string): string {
    return HttpStatusCodeLabel[getHttpStatusKey(status) as keyof typeof HttpStatusCodeLabel] ?? status ?? "—";
  }

  public get requestHeaders(): string | null {
    const raw = this.incident()?.lastRequestHeaders;

    if (raw == null) {
      return null;
    }

    try {
      return JSON.stringify(typeof raw === "string" ? JSON.parse(raw) : raw, null, 2);
    } catch {
      return String(raw);
    }
  }

  public get responseHeaders(): string | null {
    const raw = this.incident()?.lastResponseHeaders;

    if (raw == null) {
      return null;
    }

    try {
      return JSON.stringify(typeof raw === "string" ? JSON.parse(raw) : raw, null, 2);
    } catch {
      return String(raw);
    }
  }

  public getMonitorTypeLabel(type: string): string {
    return MonitorTypeLabelEnum[type as keyof typeof MonitorTypeLabelEnum] ?? type;
  }

  public async copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      Alert.success("", "Copiado para área de transferência");
    } catch { }
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      this.router.navigate(["/panel/monitoring/incidents"]);
      return;
    }

    try {
      const [incidentRes, historicalRes]: any[] = await Promise.all([
        firstValueFrom(this.incidentService.getIncidentById(id)),
        firstValueFrom(this.incidentService.getIncidentHistorical(id, 0)),
      ]);

      this.incident.set(incidentRes);
      this.historicalItems.set(historicalRes.data);
      this.historicalPagination.set({ rows: historicalRes.pagination.rows, total: historicalRes.pagination.total });
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }

  public async fetchHistoricalPage(p: number) {
    const id = this.route.snapshot.paramMap.get("id");

    if (!id) {
      return;
    }

    try {
      const historicalRes: any = await firstValueFrom(this.incidentService.getIncidentHistorical(id, p));

      this.historicalItems.set(historicalRes.data);
      this.historicalPagination.set({ rows: historicalRes.pagination.rows, total: historicalRes.pagination.total });
      this.historicalPage.set(p);
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }

}
