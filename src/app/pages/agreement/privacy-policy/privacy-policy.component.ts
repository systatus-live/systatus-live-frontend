import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { PrivacyPolicyEnUsComponent } from '../../../components/privacy-policy-en-us/privacy-policy-en-us.component';
import { PrivacyPolicyPtBrComponent } from '../../../components/privacy-policy-pt-br/privacy-policy-pt-br.component';
import { PublicHeaderComponent } from '../../../components/public-header/public-header.component';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-privacy-policy',
  imports: [
    PrivacyPolicyEnUsComponent,
    PrivacyPolicyPtBrComponent,
    TranslateModule,
    PublicHeaderComponent
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
    this.subscription = (this.i18nService.getLanguage(true) as Observable<string>).subscribe(value => {
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
