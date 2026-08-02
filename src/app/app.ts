import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HlmToaster } from './components/sonner/src';
import { AppStateService } from './state/app-state.service';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';
import { HlmProgressImports } from '@spartan-ng/helm/progress';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HlmToaster,
    ConfirmDialog,
    HlmProgressImports
  ],
  templateUrl: './app.html',
})
export class App implements OnInit {
  public readonly appState = inject(AppStateService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  public readonly isBrowser = isPlatformBrowser(this.platformId);

  ngOnInit() {
    if (!this.isBrowser) {
      return;
    }

    this.router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe(() => this.appState.increment());

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError))
      .subscribe(() => this.appState.decrement());
  }
}
