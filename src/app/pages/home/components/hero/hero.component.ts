import { Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HlmButton } from '../../../../components/button/src';

type BarStatus = 'up' | 'down' | 'degraded';

interface MonitorCard {
  name: string;
  status: BarStatus;
  latency: string;
  uptime: string;
  bars: BarStatus[];
}

@Component({
  selector: 'app-hero',
  imports: [RouterLink, HlmButton],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  private readonly platformId = inject(PLATFORM_ID);
  public readonly monitorList: MonitorCard[];

  constructor() {
    const up = (n: number): BarStatus[] => Array.from({ length: n }, (): BarStatus => 'up');

    const bars1: BarStatus[] = up(60);
    bars1[38] = 'down';
    bars1[39] = 'down';

    const bars2: BarStatus[] = up(60);
    bars2[5] = 'down';
    bars2[6] = 'down';
    bars2[7] = 'degraded';
    bars2[22] = 'degraded';
    bars2[23] = 'degraded';
    bars2[42] = 'down';

    const bars3: BarStatus[] = up(60);

    this.monitorList = [
      { name: 'website.com', status: 'up', latency: '142ms', uptime: '99.9%', bars: bars1 },
      { name: 'api.service.com', status: 'degraded', latency: '847ms', uptime: '96.2%', bars: bars2 },
      { name: 'app.dashboard.io', status: 'up', latency: '89ms', uptime: '100%', bars: bars3 },
    ];
  }

  public getStatusDotClass(status: BarStatus): string {
    if (status === 'up') { return 'bg-emerald-500'; }
    if (status === 'down') { return 'bg-red-500'; }
    return 'bg-amber-400';
  }

  public getStatusLabel(status: BarStatus): string {
    if (status === 'up') { return 'Online'; }
    if (status === 'down') { return 'Offline'; }
    return 'Lento';
  }

  public getStatusTextClass(status: BarStatus): string {
    if (status === 'up') { return 'text-emerald-400'; }
    if (status === 'down') { return 'text-red-400'; }
    return 'text-amber-400';
  }

  public getBarClass(bar: BarStatus): string {
    if (bar === 'up') { return 'bg-emerald-500'; }
    if (bar === 'down') { return 'bg-red-500'; }
    return 'bg-amber-400';
  }

  public scrollToFeatures() {
    if (isPlatformBrowser(this.platformId)) {
      document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
