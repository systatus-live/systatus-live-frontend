import { Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LucideArrowUp } from '@lucide/angular';
import { LogoComponent } from '../../../../components/logo/logo.component';

@Component({
  selector: 'app-footer',
  imports: [LucideArrowUp, LogoComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private readonly platformId = inject(PLATFORM_ID);

  public readonly currentYear = new Date().getFullYear();

  public readonly navItemList = [
    {
      title: 'Produto',
      items: [
        { name: 'Funcionalidades', href: '/#features', target: '' },
        { name: 'Como Funciona', href: '/#how-it-works', target: '' },
        { name: 'Preços', href: '/#pricing', target: '' },
      ],
    },
    {
      title: 'Contato',
      items: [
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
