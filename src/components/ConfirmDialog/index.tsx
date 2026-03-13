import { registerConfirm } from "@/lib/Alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";

type State = {
  open: boolean;
  title: string;
  text: string;
  onConfirm?: Function;
  onDeny?: Function;
}

export function ConfirmDialog() {
  const [state, setState] = useState<State>({ open: false, title: "", text: "" });

  useEffect(() => {
    registerConfirm(({ title, text, onConfirm, onDeny }) => {
      setState({ open: true, title, text, onConfirm, onDeny });
    });
  }, []);

  function close() {
    setState((s) => ({ ...s, open: false }));
  }

  return (
    <AlertDialog open={state.open} onOpenChange={(open) => !open && close()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{state.title}</AlertDialogTitle>
          <AlertDialogDescription>{state.text}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => { close(); state.onDeny?.(); }}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => { close(); state.onConfirm?.(); }}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
