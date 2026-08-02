import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { HlmButton } from '../../../components/button/src';
import { HlmInput } from '../../../components/input/src';
import { HlmLabel } from '../../../components/label/src';
import { HlmCheckboxImports } from '../../../components/checkbox/src';
import { HlmCardImports } from '../../../components/card/src';
import { HlmSelectImports } from '../../../components/select/src';
import { LogoComponent } from '../../../components/logo/logo.component';
import { AuthService } from '../../../services/auth.service';
import { Alert } from '../../../lib/alert';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    HlmButton,
    HlmInput,
    HlmLabel,
    LogoComponent,
    ...HlmCheckboxImports,
    ...HlmCardImports,
    ...HlmSelectImports,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);

  public readonly isBrowser = isPlatformBrowser(this.platformId);
  public readonly authFlow = signal<any>(null);

  public readonly discoveryList = [
    { id: "REFERRAL", description: "Indicação de amigo/colega" },
    { id: "SOCIAL", description: "Redes sociais (Instagram, Facebook, LinkedIn, etc.)" },
    { id: "AD", description: "Anúncio online (Google Ads, Facebook Ads, etc.)" },
    { id: "SEARCH", description: "Pesquisa no Google ou outro motor de busca" },
    { id: "OTHER", description: "Outros" },
  ];

  public readonly discoveryItemToString = (id: string) =>
    this.discoveryList.find(o => o.id === id)?.description ?? id;

  public readonly form = this.fb.group({
    name: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
    confirmPassword: ["", Validators.required],
    acceptTerms: [false],
    discovery: [null as string | null]
  });

  private get authFlowId(): string | undefined {
    return this.route.snapshot.queryParams["authFlowId"];
  }

  private get keepConected(): string | undefined {
    return this.route.snapshot.queryParams["keepConected"];
  }

  async ngOnInit() {
    if (this.authFlowId) {
      await this.loadAuthFlow();
    }
  }

  private async loadAuthFlow() {
    try {
      const response: any = await firstValueFrom(this.authService.getAuthFlowId(this.authFlowId!));

      this.authFlow.set(response);

      this.form.patchValue({
        name: response.name,
        email: response.email
      });
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }

  async onSubmit() {
    if (!this.form.controls.acceptTerms.value) {
      Alert.info("Termos", "Aceite os Termos de Uso e a Política de Privacidade para continuar.");
      return;
    }

    try {
      await firstValueFrom(this.authService.signUp({
        name: this.form.controls.name.value!,
        email: this.form.controls.email.value!,
        password: this.form.controls.password.value!,
        acceptTerms: this.form.controls.acceptTerms.value!,
        discovery: this.form.controls.discovery.value,
      }));

      this.router.navigate(["/auth/verify-account"], {
        queryParams: {
          authFlowId: this.authFlowId,
          keepConected: this.keepConected === "true",
        },
      });
    } catch (error: any) {
      Alert.error("", error.message);
    }
  }
}
