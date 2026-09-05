import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { StatsBarComponent } from './components/stats-bar/stats-bar.component';
import { FeaturesComponent } from './components/features/features.component';
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
    StatsBarComponent,
    FeaturesComponent,
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
      title: "Systatus.Live | Monitore sites, APIs e servidores 24/7",
      description:
        "Monitoramento contínuo de sites, APIs e servidores com alertas instantâneos via Slack, WhatsApp, Discord, e-mail e Google Chat. Saiba antes dos seus clientes quando algo cai.",
      keywords:
        "uptime, monitoramento de servidores, monitoramento de sites, monitoramento de APIs, cron job, alertas de indisponibilidade, status page, gestão de incidentes",
      canonical: "https://systatus.live",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Systatus.Live",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description":
          "Monitoramento contínuo de sites, APIs e servidores com alertas instantâneos. Saiba antes dos seus clientes quando algo cai.",
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
