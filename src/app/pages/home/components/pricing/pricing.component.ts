import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideCheck, LucideX } from '@lucide/angular';
import { HlmButton } from '../../../../components/button/src';
import { HlmBadge } from '../../../../components/badge/src';
import { PlanService } from '../../../../services/plan.service';
import { Alert } from '../../../../lib/alert';
import { formatMoney } from '../../../../utils/format-money';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-pricing',
  imports: [RouterLink, LucideCheck, LucideX, HlmButton, HlmBadge],
  templateUrl: './pricing.component.html',
})
export class PricingComponent implements OnInit {
  private readonly planService = inject(PlanService);

  public readonly planList = signal<any[]>([]);
  public readonly formatMoney = formatMoney;

  async ngOnInit() {
    try {
      const response: any = await firstValueFrom(this.planService.getPlanList());
      this.planList.set(response.data);
    } catch (error: any) {
      Alert.error('', error.message);
    }
  }
}
