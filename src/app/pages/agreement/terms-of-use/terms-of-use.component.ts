import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PublicHeaderComponent } from '../../../components/public-header/public-header.component';
import { TermsOfUseEnUsComponent } from '../../../components/terms-of-use-en-us/terms-of-use-en-us.component';
import { TermsOfUsePtBrComponent } from '../../../components/terms-of-use-pt-br/terms-of-use-pt-br.component';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-terms-of-use',
  imports: [
    TermsOfUsePtBrComponent,
    TermsOfUseEnUsComponent,
    TranslateModule,
    PublicHeaderComponent
  ],
  templateUrl: './terms-of-use.component.html',
  styleUrl: './terms-of-use.component.scss'
})
export class TermsOfUseComponent implements OnInit, OnDestroy {
  public subscription: Subscription | null = null;
  public selectedLanguage: string = "";
  public languageList: any[] = [];

  constructor(
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {
    this.subscription = this.i18nService.getLanguage().subscribe(value => {
      if (value) {
        this.selectedLanguage = value;
      }
    })

    this.languageList = this.i18nService.getLanguageList();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public onChangeLanguage(language: string) {
    this.i18nService.setLanguage(language);
  }
}
