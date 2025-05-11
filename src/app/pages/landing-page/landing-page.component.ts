import { Component, OnDestroy, OnInit } from '@angular/core';
import { LogoComponent } from '../../components/logo/logo.component';
import { ButtonModule } from 'primeng/button';
import { I18nService } from '../../services/i18n.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-page',
  imports: [
    LogoComponent,
    ButtonModule,
    SelectModule,
    FormsModule,
    RouterLink,
    TranslateModule
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
