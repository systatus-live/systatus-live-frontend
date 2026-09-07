import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { DemoTabsComponent } from './components/demo-tabs/demo-tabs.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { CtaBannerComponent } from './components/cta-banner/cta-banner.component';
import { FooterComponent } from './components/footer/footer.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  imports: [
    NavbarComponent,
    HeroComponent,
    DemoTabsComponent,
    PricingComponent,
    CtaBannerComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly seo = inject(SeoService);

  ngOnInit() {
    this.seo.update({
      title: "Systatus | Monitore sites, APIs e servidores 24/7",
      description: "Monitoramento contínuo de sites, APIs e servidores com alertas instantâneos nas principais plataformas de mensagens (Slack, WhatsApp, Discord, Google Chat, e mais). Saiba antes dos seus clientes quando algo cair.",
      keywords: "uptime, monitoramento de servidores, monitoramento de sites, monitoramento de APIs, cron job, alertas de indisponibilidade, status page, gestão de incidentes, free crons, uptime alternatives",
      canonical: "https://systatus.live",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Systatus",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": "Monitoramento contínuo de sites, APIs e servidores com alertas instantâneos. Saiba antes dos seus clientes quando algo cair.",
        "url": "https://systatus.live",
        "inLanguage": "pt-BR",
        "offers": [
          {
            "@type": "Offer",
            "name": "Gratuito",
            "price": "0",
            "priceCurrency": "BRL",
          },
          {
            "@type": "Offer",
            "name": "Pro",
            "price": "29.90",
            "priceCurrency": "BRL",
            "billingDuration": "P1M",
          },
        ],
      },
    });

    if (isPlatformBrowser(this.platformId)) {
      import('cowsay').then((cowsay: any) => {
        const say = cowsay.say ?? cowsay.default?.say;
        if (say) {
          console.info(
            say({ text: "Olá, dev!\nCaso encontre algo estranho neste site\n(além deste aviso), conte pra gente em\nhttps://systatus.live/contact" }),
            '\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
          );
        }
      });
    }
  }
}
