import { toast } from "@spartan-ng/brain/sonner";

type ConfirmFn = (title: string, text: string, onConfirm?: () => void, onDeny?: () => void) => void;

let _confirm: ConfirmFn | null = null;

export function registerAlertConfirm(fn: ConfirmFn) {
  _confirm = fn;
}

export class Alert {
  static success(title: string, text: string, timer = 3000) {
    toast.success(title || text, { description: title ? text : undefined, duration: timer });
  }

  static error(title: string, text: string, timer = 3000) {
    toast.error(title || text, { description: title ? text : undefined, duration: timer });
  }

  static info(title: string, text: string, timer = 3000) {
    toast.info(title || text, { description: title ? text : undefined, duration: timer });
  }

  static confirm(title: string, text: string, onConfirm?: () => void, onDeny?: () => void) {
    _confirm?.(title, text, onConfirm, onDeny);
  }
}
