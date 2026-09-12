import { Component, PLATFORM_ID, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { RouterLink } from "@angular/router";
import { HlmButton } from "../../../../components/button/src";

type BarStatus = "up" | "down" | "degraded";
type MonitorStatus = "up" | "down";

interface MonitorPreview {
  name: string;
  type: string;
  url: string;
  status: MonitorStatus;
  latency: string;
  interval: string;
  lastCheck: string;
  bars: BarStatus[];
  uptime: string;
}

@Component({
  selector: "app-hero",
  imports: [RouterLink, HlmButton],
  templateUrl: "./hero.component.html",
})
export class HeroComponent {
  private readonly platformId = inject(PLATFORM_ID);

  public readonly availability = "99,98%";

  public readonly monitorList: MonitorPreview[];

  constructor() {
    const up = (n: number): BarStatus[] => Array.from({ length: n }, (): BarStatus => "up");

    // API Gateway: one brief incident on day 12 (around Aug 23)
    const barsApi = up(30);
    barsApi[11] = "down";
    barsApi[12] = "degraded";

    // Web App: perfect record
    const barsWeb = up(30);

    // Checkout: incident today (Sep 11) — last 2 bars are down
    const barsCheckout = up(30);
    barsCheckout[28] = "down";
    barsCheckout[29] = "down";

    this.monitorList = [
      {
        name: "API Gateway",
        type: "HTTP/S",
        url: "api.empresa.com",
        status: "up",
        latency: "48ms",
        interval: "60s",
        lastCheck: "09:47",
        bars: barsApi,
        uptime: "99,96%",
      },
      {
        name: "Web App",
        type: "HTTP/S",
        url: "app.empresa.com",
        status: "up",
        latency: "31ms",
        interval: "60s",
        lastCheck: "09:47",
        bars: barsWeb,
        uptime: "100%",
      },
      {
        name: "Checkout",
        type: "Ping",
        url: "checkout.empresa.com",
        status: "down",
        latency: "-",
        interval: "60s",
        lastCheck: "09:42",
        bars: barsCheckout,
        uptime: "99,87%",
      },
    ];
  }

  // Matches real monitor-list getHistoricalStyle() color values
  public getBarStyle(status: BarStatus): string {
    if (status === "up") {
      return "background: #05DF72";
    }
    if (status === "down") {
      return "background: #FF6467";
    }
    return "background: #FDC700";
  }

  public scrollToPricing() {
    if (isPlatformBrowser(this.platformId)) {
      document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" });
    }
  }
}
