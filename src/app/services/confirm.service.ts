import { Injectable, signal } from "@angular/core";

export type ConfirmDialogState = {
  title: string;
  text: string;
  onConfirm?: () => void;
  onDeny?: () => void;
};

@Injectable({
  providedIn: "root",
})
export class Confirm {
  readonly dialog = signal<ConfirmDialogState | null>(null);

  show(title: string, text: string, onConfirm?: () => void, onDeny?: () => void) {
    this.dialog.set({ title, text, onConfirm, onDeny });
  }

  confirm() {
    this.dialog()?.onConfirm?.();
    this.dialog.set(null);
  }

  deny() {
    this.dialog()?.onDeny?.();
    this.dialog.set(null);
  }
}
