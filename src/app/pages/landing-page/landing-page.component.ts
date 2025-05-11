import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { PublicHeaderComponent } from '../../components/public-header/public-header.component';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-landing-page',
  imports: [
    ButtonModule,
    RouterLink,
    TranslateModule,
    PublicHeaderComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
  public statisticList: any[] = [];
  public integrationList: any[] = [];
  public currentYear: number = new Date().getFullYear();
  public languageList: any[] = [];

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
  }

  private loadStatisticList() {
    this.statisticList = [
      { label: "Monitor", description: "HTTP • HTTPS • IP" },
      { label: "24/7", description: "Availability" },
      { label: "60s", description: "Min Check Interval" },
      { label: "i18n", description: this.languageList.map(lang => lang.flag).join(" ") },
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

  private loadLanguageList() {
    this.languageList = this.i18nService.getLanguageList();
  }
}
