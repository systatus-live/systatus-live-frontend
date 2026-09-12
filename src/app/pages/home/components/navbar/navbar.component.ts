import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideMenu, LucideX } from '@lucide/angular';
import { HlmButton } from '../../../../components/button/src';
import { LogoComponent } from '../../../../components/logo/logo.component';
import { AppStateService } from '../../../../state/app-state.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, LucideMenu, LucideX, HlmButton, LogoComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  public readonly appState = inject(AppStateService);
  public readonly isMenuOpen = signal(false);

  public readonly navItemList = [
    { name: 'Plataforma', href: '/#features' },
    { name: 'Como funciona', href: '/#how-it-works' },
    { name: 'Preços', href: '/#pricing' },
  ];
}
