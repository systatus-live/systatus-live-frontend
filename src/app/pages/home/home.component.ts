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

  ngOnInit() {
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
