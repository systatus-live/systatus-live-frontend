import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nService } from '../../../services/i18n.service';
import { Subscription } from 'rxjs';
import { TermsOfUsePtBrComponent } from './terms-of-use-pt-br/terms-of-use-pt-br.component';
import { TermsOfUseEnUsComponent } from './terms-of-use-en-us/terms-of-use-en-us.component';

@Component({
  selector: 'app-terms-of-use',
  imports: [
    RouterModule,
    TermsOfUsePtBrComponent,
    TermsOfUseEnUsComponent
  ],
  templateUrl: './terms-of-use.component.html',
  styleUrl: './terms-of-use.component.scss'
})
export class TermsOfUseComponent implements OnInit, OnDestroy {
  public subscription: Subscription | null = null;
  public language: string = "";

  constructor(
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {
    this.subscription = this.i18nService.getLanguage().subscribe(value => {
      if (value) {
        this.language = value;
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
