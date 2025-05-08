import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    (window as any).googleLoginCallback = (response: any) => this.signinWithGoogle(response);
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
    console.log(response.credential);
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
    localStorage.setItem("access_token", accessToken)
    this.router.navigate(["/panel"]);
  }
}