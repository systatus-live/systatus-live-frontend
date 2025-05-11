import { Component, OnDestroy, OnInit } from '@angular/core';
import { I18nService } from '../../../services/i18n.service';
import { Subscription } from 'rxjs';
import { TermsOfUsePtBrComponent } from '../../../components/terms-of-use-pt-br/terms-of-use-pt-br.component';
import { TermsOfUseEnUsComponent } from '../../../components/terms-of-use-en-us/terms-of-use-en-us.component';
import { SelectModule } from 'primeng/select';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { LogoComponent } from '../../../components/logo/logo.component';

@Component({
  selector: 'app-terms-of-use',
  imports: [
    TermsOfUsePtBrComponent,
    TermsOfUseEnUsComponent,
    SelectModule,
    TranslateModule,
    ButtonModule,
    FormsModule,
    LogoComponent
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
