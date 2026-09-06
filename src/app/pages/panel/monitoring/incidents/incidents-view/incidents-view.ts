import { Component, OnInit, OnDestroy, inject, signal, computed } from "@angular/core";
import { DatePipe, DecimalPipe } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { firstValueFrom, Subscription } from "rxjs";
import { map, filter, distinctUntilChanged } from "rxjs/operators";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideCheck, lucideList } from "@ng-icons/lucide";
import { Incident } from "../../../../../services/incident.service";
import { Alert } from "../../../../../lib/alert";
import { HttpStatusCodeLabel, getHttpStatusKey } from "../../../../../types/http-status-code";
import { MonitorTypeLabelEnum } from "../../../../../types/monitor-type.enum";
import { HlmButton } from "../../../../../components/button/src";
import { HlmBadgeImports } from "../../../../../components/badge/src";
import { HlmTableImports } from "../../../../../components/table/src";
import { AppTable } from "../../../../../components/app-table/app-table";
import { AppNavigator } from "../../../../../components/app-navigator/app-navigator";
import { HlmSkeleton } from "../../../../../components/skeleton/src";
import { HlmTooltipImports } from "@spartan-ng/helm/tooltip";

@Component({
  selector: "app-incidents-view",
  imports: [
    DatePipe,
    DecimalPipe,
    NgIcon,
    HlmButton,
    ...HlmBadgeImports,
    ...HlmTableImports,
    AppTable,
    AppNavigator,
    HlmSkeleton,
    RouterLink,
    ...HlmTooltipImports,
  ],
  providers: [provideIcons({ lucideCheck, lucideList })],
  templateUrl: "./incidents-view.html",
  styleUrl: "./incidents-view.scss",
})
export class IncidentsView implements OnInit, OnDestroy {
  private readonly incidentService = inject(Incident);
  public readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private routeSub: Subscription | null = null;
  private routeId = "";

  public readonly incident = signal<any>(null);
  public readonly historicalItems = signal<any[]>([]);
  private readonly historicalPage = signal(0);
  public readonly historicalPagination = signal({ rows: 0, total: 0 });

  public readonly historicalHasMore = computed(() => this.historicalItems().length < this.historicalPagination().total);

  private loadingMoreHistorical = false;

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

  ngOnInit() {
    this.routeSub = this.route.paramMap.pipe(
      map(params => params.get("id")),
      filter(id => !!id),
      distinctUntilChanged(),
    ).subscribe(id => {
      this.routeId = id!;
      this.loadData(id!);
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  private async loadData(id: string) {
    this.incident.set(null);

    this.historicalItems.set([]);
    this.historicalPage.set(0);
    
    this.loadingMoreHistorical = false;

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
    const id = this.routeId;

    if (!id) {
      return;
    }

    try {
      const historicalRes: any = await firstValueFrom(this.incidentService.getIncidentHistorical(id, p));

      if (p === 0) {
        this.historicalItems.set(historicalRes.data);
      } else {
        this.historicalItems.update(prev => [...prev, ...historicalRes.data]);
      }

      this.historicalPagination.set({ rows: historicalRes.pagination.rows, total: historicalRes.pagination.total });
      this.historicalPage.set(p);
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }

  public async onLoadMoreHistorical() {
    if (this.loadingMoreHistorical || !this.historicalHasMore()) {
      return;
    }
    this.loadingMoreHistorical = true;
    await this.fetchHistoricalPage(this.historicalPage() + 1);
    this.loadingMoreHistorical = false;
  }

}
