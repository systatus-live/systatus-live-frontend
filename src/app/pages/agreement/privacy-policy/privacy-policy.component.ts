import { Component, OnDestroy, OnInit } from '@angular/core';
import { I18nService } from '../../../services/i18n.service';
import { Subscription } from 'rxjs';
import { PrivacyPolicyEnUsComponent } from '../../../components/privacy-policy-en-us/privacy-policy-en-us.component';
import { PrivacyPolicyPtBrComponent } from '../../../components/privacy-policy-pt-br/privacy-policy-pt-br.component';
import { LogoComponent } from '../../../components/logo/logo.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-privacy-policy',
  imports: [
    PrivacyPolicyEnUsComponent,
    PrivacyPolicyPtBrComponent,
    SelectModule,
    TranslateModule,
    ButtonModule,
    FormsModule,
    LogoComponent
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {
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
