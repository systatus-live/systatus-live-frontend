import { Component, OnInit } from '@angular/core';
import { LogoComponent } from '../../components/logo/logo.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-landing-page',
  imports: [
    LogoComponent,
    ButtonModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
  public statisticList: any[] = [];
  public integrationList: any[] = [];
  public currentYear: number = new Date().getFullYear();
  
  ngOnInit(): void {
    this.loadStatisticList();
    this.loadIntegrationList();
  }

  private loadStatisticList() {
    this.statisticList = [
      { label: "Multi-check", description: "HTTP, HTTPS and Ping" },
      { label: "99.99%", description: "Monitoring Uptime" },
      { label: "60s", description: "Min Check Interval" },
    ]
  }

  private loadIntegrationList() {
    this.integrationList = [
      { label: "Slack", image: "/images/slack-logo.svg" },
      { label: "Discord", image: "/images/discord-logo.svg" },
      { label: "E-mail", image: "/images/email-logo.svg" },
      { label: "Telegram", image: "/images/telegram-logo.svg" },
      { label: "Google Chat", image: "/images/google-chat-logo.svg" },
    ]
  }
}
