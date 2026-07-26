import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight } from '@lucide/angular';
import { HlmButton } from '../../../../components/button/src';

@Component({
  selector: 'app-cta-banner',
  imports: [RouterLink, LucideArrowRight, HlmButton],
  templateUrl: './cta-banner.component.html',
})
export class CtaBannerComponent {}
