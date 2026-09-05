import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterLink, Router, ActivatedRoute } from "@angular/router";
import { BrnInputOtp } from "@spartan-ng/brain/input-otp";
import { HlmButton } from "../../../components/button/src";
import { HlmCardImports } from "../../../components/card/src";
import { HlmInputOtpImports } from "../../../components/input-otp/src";
import { LogoComponent } from "../../../components/logo/logo.component";
import { AuthService } from "../../../services/auth.service";
import { AppStateService } from "../../../state/app-state.service";
import { Alert } from "../../../lib/alert";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-verify-account",
  imports: [
    RouterLink,
    BrnInputOtp,
    HlmButton,
    LogoComponent,
    ...HlmCardImports,
    ...HlmInputOtpImports,
  ],
  templateUrl: "./verify-account.html",
  styleUrl: "./verify-account.scss",
})
export class VerifyAccount implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly appState = inject(AppStateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly otp = signal("");
  public readonly authFlow = signal<any>(null);
  public readonly timer = signal(0);

  private get authFlowId(): string {
    return this.route.snapshot.queryParams["authFlowId"];
  }

  private get keepConected(): string {
    return this.route.snapshot.queryParams["keepConected"];
  }

  async ngOnInit() {
    if (this.authFlowId) {
      await this.loadAuthFlow();
    }
  }

  private async loadAuthFlow() {
    try {
      const response = await firstValueFrom(this.authService.getAuthFlowId(this.authFlowId));
      this.authFlow.set(response);
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }

  async onSubmit() {
    try {
      const response: any = await firstValueFrom(
        this.authService.checkCode({
          code: this.otp(),
          keepConected: this.keepConected === "true",
        }),
      );

      this.appState.token.set(response.data.access_token);
      localStorage.setItem("auth_token", response.data.access_token);
      this.router.navigate(["/panel"]);
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }

  async sendCode() {
    if (this.timer() > 0) {
      return;
    }

    try {
      const response: any = await firstValueFrom(
        this.authService.sendCode(this.authFlow().email),
      );

      Alert.success("", response.message);

      let seconds = 30;
      this.timer.set(seconds);

      const interval = setInterval(() => {
        this.timer.set((seconds -= 1));
        if (seconds === -1) {
          clearInterval(interval);
        }
      }, 1000);
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }
}
