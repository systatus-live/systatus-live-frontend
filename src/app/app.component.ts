import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
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
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.listenLoading();
  }

  private listenLoading(): void {
    this.loadingService.getLoading().subscribe(value => {
      this.isLoading = value;
    });
  }
}
