import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { environment } from '../../../../environments/environment';
import { LogoComponent } from '../../../components/logo/logo.component';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-signin',
  imports: [
    CardModule,
    InputTextModule,
    IftaLabelModule,
    PasswordModule,
    DividerModule,
    ButtonModule,
    SelectModule,
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    LogoComponent,
    DynamicDialogModule,
    DividerModule
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  public form: FormGroup | null = null;
  public googleClientId = environment.googleClientId;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    (window as any).googleLoginCallback = (response: any) => this.signinWithGoogle(response);
  }

  ngOnInit() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.form = this.formBuilder.group({
      email: new FormControl({ value: null, disabled: false }, [Validators.required, Validators.email]),
      password: new FormControl({ value: null, disabled: false }, [Validators.required])
    })
  }

  public signinWithPassword() {
    const { email, password } = this.form?.getRawValue();

    if (this.form?.valid) {
      this.authService.signinWithPassword(email, password).subscribe({
        next: (response) => {
          this.form?.reset();
          localStorage.setItem("access_token", response.data.access_token)
          this.router.navigate(["/panel"]);
        },
        error: ({ error }) => {
          this.notificationService.alert("Sign In", error.message, "error");
        }
      })
    }
  }

  private signinWithGoogle(response: any) {
    console.log(response);
  }
}