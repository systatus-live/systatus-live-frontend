import { Component, OnInit } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { I18nService } from '../../services/i18n.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-header',
  imports: [
    LogoComponent,
    LogoComponent,
    SelectModule,
    FormsModule,
    TranslateModule,
    ButtonModule,
    RouterLink
  ],
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.scss'
})
export class PublicHeaderComponent implements OnInit {
  public languageList: any[] = [];
  public selectedLanguage: string | null = null;
  public subscriptionList: Subscription[] = [];

  constructor(
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {
    this.loadLanguageList();
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach(subscription => subscription.unsubscribe());
  }

  public onChangeLanguage(language: string) {
    this.i18nService.setLanguage(language);
  }

  private loadLanguageList() {
    this.languageList = this.i18nService.getLanguageList();

    this.i18nService.getLanguage().subscribe(language => {
      if (language) {
        this.selectedLanguage = language;
      }
    })
  }
}
