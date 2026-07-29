import { Component, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink, Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { HlmButton } from "../../../components/button/src";
import { HlmInput } from "../../../components/input/src";
import { HlmLabel } from "../../../components/label/src";
import { HlmCheckboxImports } from "../../../components/checkbox/src";
import { HlmCardImports } from "../../../components/card/src";
import { LogoComponent } from "../../../components/logo/logo.component";
import { AuthService } from "../../../services/auth.service";
import { AppStateService } from "../../../state/app-state.service";
import { Alert } from "../../../lib/alert";
import { environment } from "../../../../environments/environment";
import { SignInTypeEnum } from "../../../types/sign-in-type.enum";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-signin",
  imports: [
    ReactiveFormsModule,
    RouterLink,
    HlmButton,
    HlmInput,
    HlmLabel,
    LogoComponent,
    ...HlmCheckboxImports,
    ...HlmCardImports,
  ],
  templateUrl: "./signin.html",
  styleUrl: "./signin.scss",
})
export class Signin implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly appState = inject(AppStateService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  public readonly isBrowser = isPlatformBrowser(this.platformId);

  public readonly form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
    keepConected: [false]
  });

  ngOnInit() {
    if (this.isBrowser) {
      this.loadGsiScript();
    }
  }

  private loadGsiScript() {
    const win = this.document.defaultView as any;

    if (win?.google) {
      this.initGsi();
      return;
    }

    const script = this.document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => this.initGsi();
    this.document.head.appendChild(script);
  }

  private initGsi() {
    const win = this.document.defaultView as any;
    const google = win?.google;

    if (!google) {
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleOAuthClientId,
      callback: (response: any) => this.onSubmitGoogle(response),
    });

    google.accounts.id.renderButton(this.document.getElementById("google-signin"), {
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular"
    });
  }

  private async submit(payload: any) {
    this.appState.loading.set(true);

    try {
      const response: any = await firstValueFrom(
        this.authService.signIn(payload)
      );

      if (response.data.signUpSignInFlow) {
        this.router.navigate(["/auth/signup"], {
          queryParams: {
            authFlowId: response.data.authFlowId,
            keepConected: payload.keepConected,
          }
        });
      } else {
        this.appState.token.set(response.data.access_token);
        localStorage.setItem("auth_token", response.data.access_token);
        this.router.navigate(["/panel"]);
      }
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }

  public async onSubmit() {
    await this.submit({
      email: this.form.controls.email.value!,
      password: this.form.controls.password.value!,
      type: SignInTypeEnum.EMAIL_PASSWORD,
      keepConected: this.form.controls.keepConected.value!,
    });
  }

  public async onSubmitGoogle(credential: any) {
    await this.submit({
      google: credential,
      type: SignInTypeEnum.GOOGLE,
      keepConected: this.form.controls.keepConected.value!,
    });
  }
}
