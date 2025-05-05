import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../../services/auth.service';
import { NotifyService } from '../../../services/notify.service';
import { LogoComponent } from '../../../components/logo/logo.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { VerifyUserComponent } from '../../../components/verify-user/verify-user.component';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-register',
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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  public discoveryList: any[] = [
    { code: "REFERRAL", name: "Friend referral" },
    { code: "SEARCH", name: "Google search" },
    { code: "AD", name: "Online ad" },
    { code: "PAGE", name: "Blog or article" },
    { code: "OTHER", name: "Other" },
  ];
  public form: FormGroup | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notifyService: NotifyService,
    private dialogService: DialogService
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
        this.notifyService.alert("Register", "Please read and accept the Terms of Service and Privacy Policy", "warn");
      } else {
        this.authService.register(this.form.getRawValue()).subscribe({
          next: (response) => {
            this.form?.reset();
            this.notifyService.alert("Register", response.message, "success");
            this.dialogService.open(VerifyUserComponent, { 
              header: "Verify your e-mail ",
              focusOnShow: false,
              closable: true,
              width: "30rem",
              modal: true
            });
          },
          error: ({ error }) => {
            this.notifyService.alert("Register", error.message, "error");
          }
        })
      }
    }
  }
}
