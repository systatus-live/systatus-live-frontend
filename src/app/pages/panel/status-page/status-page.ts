import { Component, OnInit, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { firstValueFrom } from "rxjs";
import { AppStateService } from "../../../state/app-state.service";
import { StatusPage as StatusPageService } from "../../../services/status-page";
import { MonitorService } from "../../../services/monitor.service";
import { Alert } from "../../../lib/alert";
import { environment } from "../../../../environments/environment";
import { HlmButton } from "../../../components/button/src";
import { HlmInput } from "../../../components/input/src";
import { HlmLabel } from "../../../components/label/src";
import { HlmCheckboxImports } from "../../../components/checkbox/src";
import { HlmSwitchImports } from "../../../components/switch/src";
import { HlmSeparatorImports } from "../../../components/separator/src";

function normalizeSlug(text: string): string {
  return text.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_-]/g, "_");
}

@Component({
  selector: "app-status-page",
  imports: [
    ReactiveFormsModule,
    HlmButton,
    HlmInput,
    HlmLabel,
    ...HlmCheckboxImports,
    ...HlmSwitchImports,
    ...HlmSeparatorImports,
  ],
  templateUrl: "./status-page.html",
  styleUrl: "./status-page.scss",
})
export class StatusPage implements OnInit {
  private readonly appState = inject(AppStateService);
  private readonly statusPageService = inject(StatusPageService);
  private readonly monitorService = inject(MonitorService);
  private readonly fb = inject(FormBuilder);

  public readonly monitorList = signal<any[]>([]);
  public readonly isEdit = signal(false);
  public readonly webUrl = environment.webUrl;

  public readonly form = this.fb.group({
    title: ["", [Validators.required, Validators.maxLength(60)]],
    slug: ["", [Validators.required, Validators.maxLength(40)]],
    active: [true],
    monitorIdList: [[] as string[]],
  });

  public isMonitorSelected(id: string): boolean {
    return (this.form.controls.monitorIdList.value as string[]).includes(id);
  }

  public toggleMonitor(id: string, checked: boolean) {
    const current = this.form.controls.monitorIdList.value as string[];
    if (checked) {
      this.form.controls.monitorIdList.setValue([...current, id]);
    } else {
      this.form.controls.monitorIdList.setValue(current.filter(i => i !== id));
    }
  }

  public onSlugInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const normalized = normalizeSlug(input.value);
    this.form.controls.slug.setValue(normalized);
    input.value = normalized;
  }

  async ngOnInit() {
    this.appState.loading.set(true);

    try {
      const results = await Promise.allSettled([
        firstValueFrom(this.statusPageService.getStatusPage()),
        firstValueFrom(this.monitorService.getMonitorList(new URLSearchParams({ page: "0" }))),
      ]);

      const [statusPageResult, monitorResult] = results;

      if (monitorResult.status === "fulfilled") {
        this.monitorList.set((monitorResult.value as any).data);
      }

      if (statusPageResult.status === "fulfilled") {
        const data = statusPageResult.value as any;

        if (data) {
          this.isEdit.set(true);
  
          this.form.patchValue({
            title: data.title,
            slug: data.slug,
            active: data.active,
            monitorIdList: data.monitorIdList,
          });
        }

      } else if ((statusPageResult.reason as any)?.status !== 404) {
        Alert.error("", (statusPageResult.reason as any)?.message);
      }
    } finally {
      this.appState.loading.set(false);
    }
  }

  public async handleSave() {
    if (this.form.invalid) {
      return;
    }

    this.appState.loading.set(true);

    try {
      const payload = {
        title: this.form.controls.title.value,
        slug: this.form.controls.slug.value,
        active: this.form.controls.active.value,
        monitorIdList: this.form.controls.monitorIdList.value,
      };

      const response: any = await firstValueFrom(
        this.isEdit() ? this.statusPageService.updateStatusPage(payload) : this.statusPageService.createStatusPage(payload),
      );

      Alert.success("", response.message);
      this.isEdit.set(true);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }
}
