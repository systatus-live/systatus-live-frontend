import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PublicHeaderComponent } from '../../components/public-header/public-header.component';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-landing-page',
  imports: [
    ButtonModule,
    RouterLink,
    TranslateModule,
    PublicHeaderComponent,
    TableModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
  public statisticList: any[] = [];
  public integrationList: any[] = [];
  public currentYear: number = new Date().getFullYear();
  public languageList: any[] = [];
  public planList: any[] = [];

  constructor(
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.loadLanguageList();
    this.loadStatisticList();
    this.loadIntegrationList();
    this.loadFeatureList();
  }

  private loadStatisticList() {
    this.statisticList = [
      { label: "Monitor", description: "HTTP • HTTPS • Ping" },
      { label: "24/7", description: "Availability" },
      { label: "1 min.", description: "Min Check Interval" },
      { label: "i18n", description: this.languageList.map(lang => lang.flag).join(" ") },
    ]
  }

  private loadIntegrationList() {
    this.integrationList = [
      { label: "Slack", image: "/images/slack-logo.svg" },
      { label: "Discord", image: "/images/discord-logo.svg" },
      { label: "E-mail", image: "/images/email-logo.svg" },
      { label: "Google Chat", image: "/images/google-chat-logo.svg" },
    ]
  }

  private loadLanguageList() {
    this.languageList = this.i18nService.getLanguageList();
  }

  private loadFeatureList() {
    this.planList = [
      {
        name: "Free Plan",
        note: "No credit card required",
        link: "",
        features: [
          { label: "Up to 10 monitors", checked: true },
          { label: "5 min. check interval", checked: true },
          { label: "HTTP, HTTPS, Ping", checked: true },
          { label: "Normal e-mail support", checked: true },
          { label: "24h live chat support", checked: false },
          { label: "Slack integration", checked: true },
          { label: "Discord integration", checked: true },
          { label: "E-mail integration", checked: true },
          { label: "Google Chat integration", checked: true },
          { label: "WhatsApp integration", checked: false },
          { label: "Customizable messages", checked: false }
        ],
      },
      {
        name: "Pro Plan",
        note: "Coming soon",
        link: "",
        features: [
          { label: "Up to 50 monitors", checked: true },
          { label: "1 min. check interval", checked: true },
          { label: "HTTP, HTTPS, Ping", checked: true },
          { label: "Normal e-mail support", checked: true },
          { label: "24h live chat support", checked: true },
          { label: "Slack integration", checked: true },
          { label: "Discord integration", checked: true },
          { label: "E-mail integration", checked: true },
          { label: "Google Chat integration", checked: true },
          { label: "WhatsApp integration", checked: true },
          { label: "Customizable messages", checked: true }
        ]
      }
    ]
  }
}
