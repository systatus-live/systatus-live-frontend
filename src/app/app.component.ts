import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import { I18nService } from './services/i18n.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastModule,
    BlockUIModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public isLoading: boolean = false;

  constructor(
    private loadingService: LoadingService,
    private i18nService: I18nService
  ) { }

  ngOnInit(): void {
    this.listenLoading();

    this.i18nService.setLanguage();
    this.i18nService.getLanguage().subscribe(language => {
      if (language) {
        localStorage.setItem("language", language);
      }
    })
  }

  private listenLoading(): void {
    this.loadingService.getLoading().subscribe(value => {
      this.isLoading = value;
    });
  }
}
