import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { LogoComponent } from '../../../components/logo/logo.component';
import { VerifyUserComponent } from '../../../components/verify-user/verify-user.component';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-signup',
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
    RouterLink,
    TranslateModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  public discoveryList: any[] = [
    { code: "REFERRAL", name: "Friend referral" },
    { code: "SEARCH", name: "Google search" },
    { code: "AD", name: "Online AD" },
    { code: "PAGE", name: "Blog or article" },
    { code: "OTHER", name: "Other" },
  ];
  public form: FormGroup | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private router: Router,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.form = this.formBuilder.group({
      name: new FormControl({ value: null, disabled: false }, [Validators.required]),
      email: new FormControl({ value: null, disabled: false }, [Validators.required, Validators.email]),
      password: new FormControl({ value: null, disabled: false }, [Validators.required]),
      confirmPassword: new FormControl({ value: null, disabled: false }, [Validators.required]),
      acceptTerms: new FormControl({ value: false, disabled: false }),
      discovery: new FormControl({ value: false, disabled: false }),
    }, {
      validators: [this.checkPasswords.bind(this), this.checkPasswordComplexity.bind(this)]
    })
  }

  private checkPasswords(formGroup: FormGroup) {
    const password = formGroup.controls["password"].value;
    const confirmPassword = formGroup.controls["confirmPassword"].value;
    if (password !== confirmPassword) {
      return {
        passwordNotMatch: true
      }
    }
    return null;
  }

  private checkPasswordComplexity(formGroup: FormGroup) {
    const password = formGroup.controls["password"].value;
    if (password != null && (password.length < 8 || password.search(/[a-z]/) < 0 || password.search(/[A-Z]/) < 0 || password.search(/[0-9]/) < 0)) {
      return {
        passwordComplexity: true
      }
    }
    return null;
  }

  public submit() {
    const formValues = this.form?.getRawValue();

    if (this.form?.valid) {
      if (!formValues.acceptTerms) {
        this.notificationService.alert("Sign Up", "Please read and accept the Terms of Service and Privacy Policy", "warn");
      } else {
        this.authService.signUp(formValues).subscribe({
          next: (response) => {
            const dialogRef = this.dialogService.open(VerifyUserComponent, {
              header: this.translateService.instant("verifyUserComponent.title", { email: formValues.email }),
              focusOnShow: false,
              closable: true,
              width: "30rem",
              modal: true,
              data: {
                email: formValues.email
              }
            });

            dialogRef.onClose.subscribe(value => {
              if (value === true) {
                this.notificationService.alert(response.message, "Sig in to continue", "success");
                this.router.navigate(["/auth/signin"]);
              }
            })

            this.form?.reset();
          },
          error: ({ error }) => {
            this.notificationService.alert("Sign Up", error.message, "error");
          }
        })
      }
    }
  }
}
