import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideCheck } from "@ng-icons/lucide";
import { HlmButton } from "../../../components/button/src";
import { HlmInput } from "../../../components/input/src";
import { HlmLabel } from "../../../components/label/src";
import { HlmCardImports } from "../../../components/card/src";
import { LogoComponent } from "../../../components/logo/logo.component";
import { AuthService } from "../../../services/auth.service";
import { Alert } from "../../../lib/alert";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-forgot-password",
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    HlmButton,
    HlmInput,
    HlmLabel,
    LogoComponent,
    ...HlmCardImports,
  ],
  providers: [provideIcons({ lucideCheck })],
  templateUrl: "./forgot-password.html",
  styleUrl: "./forgot-password.scss",
})
export class ForgotPassword {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  public readonly isSubmitted = signal(false);
  public readonly message = signal<string | null>(null);

  public readonly form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
  });

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }

    try {
      const response: any = await firstValueFrom(
        this.authService.forgotPassword(this.form.controls.email.value!),
      );

      this.isSubmitted.set(true);
      this.message.set(response.message);
      this.form.reset();
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }
}
