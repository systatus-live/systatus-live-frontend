import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-panel',
  imports: [
    ButtonModule
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {
  constructor(
    private authService: AuthService
  ) { }

  public signout() {
    this.authService.signOut();
  }
}
