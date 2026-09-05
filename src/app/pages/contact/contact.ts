import { Component, OnDestroy, OnInit } from '@angular/core';
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
  ngOnInit() {
    document.documentElement.classList.add("dark");
  }

  ngOnDestroy() {
    document.documentElement.classList.remove("dark");
  }
}
