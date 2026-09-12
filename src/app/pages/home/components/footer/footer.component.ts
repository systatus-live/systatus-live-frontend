import { Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LucideArrowUp } from '@lucide/angular';
import { LogoComponent } from '../../../../components/logo/logo.component';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
  selector: 'app-footer',
  imports: [
    LucideArrowUp,
    LogoComponent,
    HlmTooltipImports
  ],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private readonly platformId = inject(PLATFORM_ID);

  public readonly currentYear = new Date().getFullYear();

  public readonly navItemList = [
    {
      title: 'Produto',
      items: [
        { name: 'Plataforma', href: '/#features', target: '' },
        { name: 'Como funciona', href: '/#how-it-works', target: '' },
        { name: 'Preços', href: '/#pricing', target: '' },
      ],
    },
    {
      title: 'Conta',
      items: [
        { name: 'Entrar', href: '/auth/signin', target: '' },
        { name: 'Criar conta', href: '/auth/signup', target: '' },
        { name: 'Fale Conosco', href: '/contact', target: '' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { name: 'Política de Privacidade', href: 'agreements/privacy-policy', target: '_blank' },
        { name: 'Termos de Uso', href: 'agreements/terms-of-use', target: '_blank' },
      ],
    },
  ];

  public scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
