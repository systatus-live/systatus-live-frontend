import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from '../home/components/navbar/navbar.component';
import { FooterComponent } from '../home/components/footer/footer.component';
import { ContactForm } from './components/contact-form/contact-form';

@Component({
  selector: 'app-contact',
  imports: [NavbarComponent, FooterComponent, ContactForm],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.add("dark");
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.remove("dark");
    }
  }
}
