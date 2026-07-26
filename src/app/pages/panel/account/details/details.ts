import { Component, OnInit, OnDestroy, inject, signal, PLATFORM_ID, ElementRef, ViewChild } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { firstValueFrom } from "rxjs";
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
  lucideUser,
  lucideShield,
  lucideMonitor,
  lucideKeyRound,
  lucidePencil,
  lucideUpload,
  lucideTrash2,
  lucideCalendar,
} from "@ng-icons/lucide";
import UAParser from "my-ua-parser";
import { AppStateService } from "../../../../state/app-state.service";
import { User } from "../../../../services/user";
import { Alert } from "../../../../lib/alert";
import { SignInTypeEnum } from "../../../../types/sign-in-type.enum";
import { HlmButton } from "../../../../components/button/src";
import { HlmInput } from "../../../../components/input/src";
import { HlmLabel } from "../../../../components/label/src";
import { HlmTableImports } from "../../../../components/table/src";
import { HlmBadgeImports } from "../../../../components/badge/src";
import { HlmSeparatorImports } from "../../../../components/separator/src";

@Component({
  selector: "app-details",
  imports: [
    ReactiveFormsModule,
    DatePipe,
    NgIcon,
    HlmButton,
    HlmInput,
    HlmLabel,
    ...HlmTableImports,
    ...HlmBadgeImports,
    ...HlmSeparatorImports,
  ],
  providers: [
    provideIcons({
      lucideUser,
      lucideShield,
      lucideMonitor,
      lucideKeyRound,
      lucidePencil,
      lucideUpload,
      lucideTrash2,
      lucideCalendar,
    }),
  ],
  templateUrl: "./details.html",
  styleUrl: "./details.scss",
})
export class Details implements OnInit, OnDestroy {
  public readonly appState = inject(AppStateService);
  private readonly userService = inject(User);
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild("fileInput") fileInputRef!: ElementRef<HTMLInputElement>;
  private avatarFile: File | null = null;

  public readonly SignInTypeEnum = SignInTypeEnum;
  public readonly detailsExpanded = signal(false);
  public readonly passwordExpanded = signal(false);
  public readonly avatarPreview = signal<string | null>(null);
  public readonly isChangedAvatar = signal(false);
  public readonly authHistory = signal<any[]>([]);
  public readonly pagination = signal({ page: 0, rows: 0, total: 0 });

  public get totalPages(): number {
    const { total, rows } = this.pagination();
    return rows > 0 ? Math.ceil(total / rows) : 1;
  }

  public readonly detailsForm = this.fb.group({
    name: ["", [Validators.required, Validators.maxLength(50)]],
    email: ["", [Validators.required, Validators.email, Validators.maxLength(255)]],
  });

  public readonly passwordForm = this.fb.group({
    currentPassword: [""],
    newPassword: ["", Validators.required],
    confirmPassword: ["", Validators.required],
  });

  public getAvatarSrc(): string {
    const preview = this.avatarPreview();
    if (preview) {
      return preview;
    }
    const avatar = this.appState.user()?.avatar;
    if (avatar) {
      return avatar;
    }
    return "/images/avatar.jpg";
  }

  public formatMemberSince(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  public getDevice(userAgent: string): string {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    if (result.browser.name) {
      return `${result.os.name} • ${result.browser.name} ${result.browser.version}`;
    }
    return userAgent;
  }

  public triggerFileInput() {
    this.fileInputRef?.nativeElement.click();
  }

  public onUploadAvatar(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image") || file.size > 1024 * 1024) {
      Alert.info("", "Imagem inválida. Use JPG ou PNG com no máximo 1MB.");
      return;
    }

    this.revokePreview();
    this.avatarFile = file;

    if (isPlatformBrowser(this.platformId)) {
      this.avatarPreview.set(URL.createObjectURL(file));
    }

    this.isChangedAvatar.set(true);
    input.value = "";
  }

  public onDeleteAvatar() {
    this.revokePreview();
    this.avatarFile = null;
    this.avatarPreview.set(null);
    this.isChangedAvatar.set(true);
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = "";
    }
  }

  public toggleDetails() {
    if (this.detailsExpanded()) {
      this.detailsForm.patchValue({
        name: this.appState.user()?.name ?? "",
        email: this.appState.user()?.email ?? "",
      });
      this.revokePreview();
      this.avatarPreview.set(null);
      this.isChangedAvatar.set(false);
    }
    this.detailsExpanded.update(v => !v);
  }

  public togglePassword() {
    if (this.passwordExpanded()) {
      this.passwordForm.reset();
    }
    this.passwordExpanded.update(v => !v);
  }

  public async loadAuthHistory(page: number) {
    this.appState.loading.set(true);

    try {
      const response: any = await firstValueFrom(
        this.userService.getAuthHistory(new URLSearchParams({ page: page.toString() })),
      );

      this.authHistory.set(response.data);
      this.pagination.set({
        page,
        rows: response.pagination.rows,
        total: response.pagination.total,
      });
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }

  public async onSubmitDetails() {
    if (this.detailsForm.invalid) {
      return;
    }

    this.appState.loading.set(true);

    try {
      const formData = new FormData();
      formData.append("name", this.detailsForm.controls.name.value ?? "");
      formData.append("email", this.detailsForm.controls.email.value ?? "");

      if (this.isChangedAvatar()) {
        if (this.avatarFile) {
          formData.append("avatar", this.avatarFile);
        } else {
          formData.append("rmAvatar", "1");
        }
      }

      const response: any = await firstValueFrom(this.userService.updateUserDetails(formData));

      this.appState.user.update(u => ({
        ...u,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar,
      }));

      if (this.isChangedAvatar()) {
        this.revokePreview();
        this.avatarPreview.set(null);
        this.isChangedAvatar.set(false);
      }

      this.detailsExpanded.set(false);
      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }

  public async onSubmitPassword() {
    if (this.passwordForm.invalid) {
      return;
    }

    this.appState.loading.set(true);

    try {
      const response: any = await firstValueFrom(
        this.userService.updateUserPassword({
          newPassword: this.passwordForm.controls.newPassword.value,
          currentPassword: this.passwordForm.controls.currentPassword.value,
        }),
      );

      this.appState.user.update(u => ({ ...u, signinType: SignInTypeEnum.EMAIL_PASSWORD }));
      this.passwordForm.reset();
      this.passwordExpanded.set(false);
      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      this.appState.loading.set(false);
    }
  }

  private revokePreview() {
    const preview = this.avatarPreview();
    if (preview && isPlatformBrowser(this.platformId)) {
      URL.revokeObjectURL(preview);
    }
  }

  async ngOnInit() {
    const user = this.appState.user();
    this.detailsForm.patchValue({
      name: user?.name ?? "",
      email: user?.email ?? "",
    });

    await this.loadAuthHistory(0);
  }

  ngOnDestroy() {
    this.revokePreview();
  }
}
