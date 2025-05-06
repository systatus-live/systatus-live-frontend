import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputOtpModule } from 'primeng/inputotp';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-verify-user',
  imports: [
    InputOtpModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './verify-user.component.html',
  styleUrl: './verify-user.component.scss'
})
export class VerifyUserComponent implements OnInit {
  public form: FormGroup | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private dynamicDialogRef: DynamicDialogRef
  ) { }

  ngOnInit() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.form = this.formBuilder.group({
      code: new FormControl({ value: null, disabled: false }, [Validators.required]),
    })
  }

  public submit() {
    if (this.form?.valid) {
      this.authService.verifyCode(this.form?.getRawValue().code).subscribe({
        next: (_) => {
          this.form?.reset();
          this.dynamicDialogRef.close(true);
        },
        error: ({ error }) => {
          this.notificationService.alert("Verify", error.message, "error");

        }
      })
    }
  }
}
