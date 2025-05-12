import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputOtpModule } from 'primeng/inputotp';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-verify-user',
  imports: [
    InputOtpModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './verify-user.component.html',
  styleUrl: './verify-user.component.scss'
})
export class VerifyUserComponent implements OnInit {
  public form: FormGroup | null = null;
  public resendTimer: number = 0;
  public resendInterval: any = null;
  public userEmail: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig
  ) { }

  ngOnInit() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.form = this.formBuilder.group({
      code: new FormControl({ value: null, disabled: false }, [Validators.required]),
    })

    this.userEmail = this.dynamicDialogConfig.data.email;
  }

  public submit() {
    if (this.form?.valid) {
      this.authService.verifyCode(this.form?.getRawValue().code).subscribe({
        next: (_) => {
          if (this.resendInterval) {
            clearInterval(this.resendInterval!);
          }
          this.form?.reset();
          this.dynamicDialogRef.close(true);
        },
        error: ({ error }) => {
          this.notificationService.alert("Verify", error.message, "error");
        }
      })
    }
  }

  public sendCode() {
    if (this.resendTimer == 0) {
      this.authService.sendCode(this.userEmail).subscribe({
        next: (response) => {
          this.resendTimer = 30;
          
          this.resendInterval = setInterval(() => {
            this.resendTimer--;
            if (this.resendTimer == 0) {
              clearInterval(this.resendInterval);
            }
          }, 1000);

          this.form?.reset();
          this.notificationService.alert("Verify", response.message, "success");
        },
        error: ({ error }) => {
          this.notificationService.alert("Resend code", error.message, "error");

        }
      })
    }
  }
}
