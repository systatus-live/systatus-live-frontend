import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink, Router, ActivatedRoute } from "@angular/router";
import { HlmButton } from "../../../components/button/src";
import { HlmInput } from "../../../components/input/src";
import { HlmLabel } from "../../../components/label/src";
import { HlmCardImports } from "../../../components/card/src";
import { LogoComponent } from "../../../components/logo/logo.component";
import { AuthService } from "../../../services/auth.service";
import { Alert } from "../../../lib/alert";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-reset-password",
  imports: [
    ReactiveFormsModule,
    RouterLink,
    HlmButton,
    HlmInput,
    HlmLabel,
    LogoComponent,
    ...HlmCardImports,
  ],
  templateUrl: "./reset-password.html",
  styleUrl: "./reset-password.scss",
})
export class ResetPassword {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  private get token(): string {
    return this.route.snapshot.queryParams["token"];
  }

  public readonly form = this.fb.group({
    password: ["", Validators.required],
    confirmPassword: ["", Validators.required],
  });

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }

    try {
      const response: any = await firstValueFrom(
        this.authService.resetPassword(this.form.controls.password.value!, this.token),
      );

      Alert.success("", response.message);
      this.router.navigate(["/auth/signin"]);
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }
}
