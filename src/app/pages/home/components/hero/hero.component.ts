import { Component, PLATFORM_ID, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { RouterLink } from "@angular/router";
import { HlmButton } from "../../../../components/button/src";
import { HlmTooltip } from "@spartan-ng/helm/tooltip";

type BarStatus = "up" | "down" | "degraded";

interface MonitorCard {
  name: string;
  status: BarStatus;
  latency: string;
  uptime: string;
  bars: BarStatus[];
}

@Component({
  selector: "app-hero",
  imports: [
    RouterLink, 
    HlmButton,
    HlmTooltip
  ],
  templateUrl: "./hero.component.html",
})
export class HeroComponent {
  private readonly platformId = inject(PLATFORM_ID);
  public readonly monitorList: MonitorCard[];

  constructor() {
    const up = (n: number): BarStatus[] => Array.from({ length: n }, (): BarStatus => "up");

    const bars1: BarStatus[] = up(30);
    bars1[18] = "down";
    bars1[19] = "down";

    const bars2: BarStatus[] = up(30);
    bars2[5] = "down";
    bars2[6] = "down";
    bars2[7] = "degraded";
    bars2[22] = "down";
    bars2[23] = "degraded";

    const bars3: BarStatus[] = up(30);

    this.monitorList = [
      { name: "website.com", status: "up", latency: "142ms", uptime: "99.9%", bars: bars1 },
      { name: "api.service.com", status: "degraded", latency: "847ms", uptime: "96.2%", bars: bars2 },
      { name: "app.dashboard.io", status: "up", latency: "89ms", uptime: "100%", bars: bars3 },
    ];
  }

  public readonly featurePills = [
    "Monitoramento Contínuo",
    "Alertas Instantâneos",
    "Histórico de Monitoramento",
    "Gestão de Incidentes",
    "Página de Status Pública",
    "Análise de Desempenho",
  ];

  public readonly channelList = [
    { name: 'Slack', logo: '/logos/slack.svg' },
    { name: 'WhatsApp', logo: '/logos/whatsapp.svg' },
    { name: 'Discord', logo: '/logos/discord.svg' },
    { name: 'E-mail', logo: '/logos/mail.svg' },
    { name: 'Google Chat', logo: '/logos/google-chat.svg' },
    { name: 'Mattermost', logo: '/logos/mattermost-white.svg' },
  ];

  public getBarClass(status: BarStatus): string {
    if (status === "up") {
      return "bg-emerald-500";
    }
    if (status === "down") {
      return "bg-red-500";
    }
    return "bg-amber-400";
  }

  public getStatusTextClass(status: BarStatus): string {
    if (status === "up") {
      return "text-emerald-400";
    }
    if (status === "down") {
      return "text-red-400";
    }
    return "text-amber-400";
  }

  public scrollToFeatures() {
    if (isPlatformBrowser(this.platformId)) {
      document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
    }
  }
}
