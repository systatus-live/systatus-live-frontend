import { toast } from "sonner";

type ConfirmPayload = {
  title: string;
  text: string;
  onConfirm?: Function;
  onDeny?: Function;
}

let _showConfirm: ((payload: ConfirmPayload) => void) | null = null;

export function registerConfirm(fn: typeof _showConfirm) {
  _showConfirm = fn;
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

  static confirm(title: string, text: string, onConfirm?: Function, onDeny?: Function) {
    _showConfirm?.({ title, text, onConfirm, onDeny });
  }
}
