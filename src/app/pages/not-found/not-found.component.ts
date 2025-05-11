import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  imports: [
    LottieComponent,
    ButtonModule,
    TranslateModule
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  public animationOptions: AnimationOptions = {
    path: "/images/not-found-animation.json"
  };

  constructor(
    private router: Router
  ) { }

  navigate() {
    this.router.navigate(["/"]);
  }
}
