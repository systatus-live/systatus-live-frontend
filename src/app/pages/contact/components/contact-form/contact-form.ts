import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideCheck, LucideMail, LucideMapPin } from '@lucide/angular';
import { HlmButton } from '../../../../components/button/src';
import { HlmInput } from '../../../../components/input/src';
import { HlmTextarea } from '../../../../components/textarea/src';
import { HlmLabel } from '../../../../components/label/src';
import { HlmSelectImports } from '../../../../components/select/src';
import { HttpService } from '../../../../services/http.service';
import { Alert } from '../../../../lib/alert';
import { environment } from '../../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, LucideCheck, LucideMail, LucideMapPin, HlmButton, HlmInput, HlmTextarea, HlmLabel, ...HlmSelectImports],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  private readonly http = inject(HttpService);
  private readonly fb = inject(FormBuilder);

  public readonly from = input<{ name: string; email: string } | null>(null);

  public readonly isSubmitting = signal(false);
  public readonly isSubmitted = signal(false);

  constructor() {
    effect(() => {
      const from = this.from();
      if (from) {
        this.form.controls.name.setValue(from.name);
        this.form.controls.email.setValue(from.email);
      }
    });
  }

  public readonly subjectList = [
    { description: "Conta e acesso" },
    { description: "Sugestões, bugs e melhorias" },
    { description: "Planos e cobrança" },
    { description: "Encerramento de conta" },
    { description: "Outros assuntos" },
  ];

  public readonly form = this.fb.group({
    name: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    subject: ["", Validators.required],
    message: ["", Validators.required],
  });

  public get messageLength(): number {
    return this.form.controls.message.value?.length ?? 0;
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.isSubmitting.set(true);
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/v1/supports/mails`, this.form.value));
      this.isSubmitted.set(true);
      this.form.reset();
    } catch (_: any) {
      Alert.error("", "Não foi possível enviar sua mensagem, tente novamente ou fale diretamente com systatus@artcode.dev.", 5000);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  public resetForm() {
    this.isSubmitted.set(false);
  }
}
