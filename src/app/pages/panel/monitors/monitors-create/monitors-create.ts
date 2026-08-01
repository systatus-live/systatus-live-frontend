import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucidePencil } from "@ng-icons/lucide";
import { AppStateService } from "../../../../state/app-state.service";
import { MonitorService } from "../../../../services/monitor.service";
import { Interval } from "../../../../services/interval";
import { Integration } from "../../../../services/integration";
import { Alert } from "../../../../lib/alert";
import { MonitorTypeEnum, MonitorTypeLabelEnum } from "../../../../types/monitor-type.enum";
import { HlmButton } from "../../../../components/button/src";
import { HlmInput } from "../../../../components/input/src";
import { HlmLabel } from "../../../../components/label/src";
import { HlmSelectImports } from "../../../../components/select/src";
import { HlmCheckboxImports } from "../../../../components/checkbox/src";
import { HlmSwitchImports } from "../../../../components/switch/src";
import { HlmSeparatorImports } from "../../../../components/separator/src";

@Component({
  selector: "app-monitors-create",
  imports: [
    ReactiveFormsModule,
    RouterLink,
    HlmButton,
    HlmInput,
    HlmLabel,
    ...HlmSelectImports,
    ...HlmCheckboxImports,
    ...HlmSwitchImports,
    ...HlmSeparatorImports,
  ],
  providers: [provideIcons({ lucidePencil })],
  templateUrl: "./monitors-create.html",
  styleUrl: "./monitors-create.scss",
})
export class MonitorsCreate implements OnInit {
  private readonly appState = inject(AppStateService);
  private readonly monitorService = inject(MonitorService);
  private readonly intervalService = inject(Interval);
  private readonly integrationService = inject(Integration);
  public readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  public readonly intervalList = signal<any[]>([]);
  public readonly integrationList = signal<any[]>([]);

  public readonly monitorTypeList = Object.entries(MonitorTypeEnum).map(([key]) => ({
    id: key,
    description: MonitorTypeLabelEnum[key as MonitorTypeEnum],
  }));

  public readonly form = this.fb.group({
    name: ["", [Validators.required, Validators.maxLength(128)]],
    type: ["", Validators.required],
    address: ["", [Validators.required, Validators.maxLength(1000)]],
    active: [true],
    integrationList: [[] as string[]],
    intervalId: ["", Validators.required],
  });

  public readonly typeItemToString = (id: string) =>
    this.monitorTypeList.find(t => t.id === id)?.description ?? id;

  public readonly intervalItemToString = (id: string) =>
    this.intervalList().find(i => i.id === id)?.name ?? id;

  async ngOnInit() {
    this.appState.loading.set(true);

    try {
      const [intervalRes, integrationRes]: any[] = await Promise.all([
        firstValueFrom(this.intervalService.getIntervalList(new URLSearchParams({ page: "0" }))),
        firstValueFrom(this.integrationService.getIntegrationList(new URLSearchParams({ page: "0" }))),
      ]);

      this.intervalList.set(intervalRes.data);
      this.integrationList.set(integrationRes.data);

      this.form.patchValue({
        active: true,
        type: this.monitorTypeList[0]?.id ?? "",
        intervalId: intervalRes.data[0]?.id ?? "",
        integrationList: [],
      });
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }

  public isIntegrationSelected(id: string): boolean {
    return (this.form.controls.integrationList.value as string[]).includes(id);
  }

  public toggleIntegration(id: string, checked: boolean) {
    const current = this.form.controls.integrationList.value as string[];
    if (checked) {
      this.form.controls.integrationList.setValue([...current, id]);
    } else {
      this.form.controls.integrationList.setValue(current.filter(i => i !== id));
    }
  }

  async handleSave() {
    if (this.form.invalid) {
      return;
    }

    this.appState.loading.set(true);

    try {
      const response: any = await firstValueFrom(
        this.monitorService.createMonitor({
          name: this.form.controls.name.value,
          type: this.form.controls.type.value,
          address: this.form.controls.address.value,
          active: this.form.controls.active.value,
          integrationList: this.form.controls.integrationList.value,
          intervalId: this.form.controls.intervalId.value,
        }),
      );

      Alert.success("", response.message);
      this.router.navigate(["/panel/monitors/edit", response.data.id]);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }
}
