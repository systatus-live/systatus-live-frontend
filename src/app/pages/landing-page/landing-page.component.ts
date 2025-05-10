import { Component, OnDestroy, OnInit } from '@angular/core';
import { LogoComponent } from '../../components/logo/logo.component';
import { ButtonModule } from 'primeng/button';
import { I18nService } from '../../services/i18n.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [
    LogoComponent,
    ButtonModule,
    SelectModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, OnDestroy {
  public statisticList: any[] = [];
  public integrationList: any[] = [];
  public currentYear: number = new Date().getFullYear();
  public languageList: any[] = [];
  public selectedLanguage: string | null = null;
  public subscriptionList: Subscription[] = [];

  constructor(
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach(subscription => subscription.unsubscribe());
  }


  private loadInitialData() {
    this.loadStatisticList();
    this.loadIntegrationList();
    this.loadLanguageList();
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

  private loadLanguageList() {
    this.languageList = this.i18nService.getLanguageList();

    this.i18nService.getLanguage().subscribe(language => {
      if (language) {
        this.selectedLanguage = language;
      }
    })
  }

  public onChangeLanguage(language: string) {
    this.i18nService.setLanguage(language);
  }
}
