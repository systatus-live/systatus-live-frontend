import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { environment } from '../../../../environments/environment';
import { LogoComponent } from '../../../components/logo/logo.component';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { VerifyUserComponent } from '../../../components/verify-user/verify-user.component';

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
    DividerModule,
    RouterLink
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  public form: FormGroup | null = null;
  public googleClientId = environment.googleClientId;
  public rememberLogin: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.form = this.formBuilder.group({
      email: new FormControl({ value: null, disabled: false }, [Validators.required, Validators.email]),
      password: new FormControl({ value: null, disabled: false }, [Validators.required])
    })

    this.initializeGoogleSignin();
  }

  private initializeGoogleSignin() {
    (window as any).google.accounts.id.initialize({
      client_id: this.googleClientId,
      callback: this.signinWithGoogle.bind(this),
      auto_select: true,
      itp_support: true,
    });

    (window as any).google.accounts.id.renderButton(
      document.getElementById("google-button"),
      {
        shape: "rectangular",
        theme: "outline",
        text: "signin_with",
        size: "large",
        logo_alignment: "left"
      }
    );
  }

  public signinWithPassword() {
    const { email, password } = this.form?.getRawValue();

    if (this.form?.valid) {
      this.authService.signinWithPassword(email, password).subscribe({
        next: (response) => {
          if (response.data.verified) {
            this.signinCallback(response.data.access_token);
          } else {
            const dialogRef = this.dialogService.open(VerifyUserComponent, {
              header: "Verify your e-mail ",
              focusOnShow: false,
              closable: true,
              width: "30rem",
              modal: true,
              data: {
                email: email
              }
            });

            dialogRef.onClose.subscribe(value => {
              if (value === true) {
                this.signinCallback(response.data.access_token);
              }
            })
          }
        },
        error: ({ error }) => {
          this.notificationService.alert("Sign In", error.message, "error");
        }
      })
    }
  }

  private signinWithGoogle(response: any) {
    this.authService.signinWithGoogle(response.credential).subscribe({
      next: (response) => {
        this.signinCallback(response.data.access_token);
      },
      error: ({ error }) => {
        this.notificationService.alert("Google sign In", error.message, "error");
      }
    })
  }

  private signinCallback(accessToken: string) {
    this.form?.reset();
    if (this.rememberLogin) {
      localStorage.setItem("access_token", accessToken)
    } else {
      sessionStorage.setItem("access_token", accessToken)
    }
    this.router.navigate(["/panel"]);
  }
}