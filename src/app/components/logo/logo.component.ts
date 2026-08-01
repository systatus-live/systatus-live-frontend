import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
  selector: 'app-logo',
  imports: [
    RouterLink,
    HlmTooltipImports
  ],
  templateUrl: './logo.component.html',
})
export class LogoComponent {
  readonly inverted = input(false);
  readonly iconOnly = input(false);
}
