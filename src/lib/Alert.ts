import Swal from "sweetalert2";

export class Alert {
  static success(title: string, text: string, timer = 3000) {
    Swal.fire({
      title: title,
      text: text,
      icon: "success",
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
      showCloseButton: true,
    })
  }

  static error(title: string, text: string, timer = 3000) {
    Swal.fire({
      title: title,
      text: text,
      icon: "error",
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
      showCloseButton: true
    })
  }

  static info(title: string, text: string, timer = 3000) {
    Swal.fire({
      title: title,
      text: text,
      icon: "info",
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
      showCloseButton: true
    })
  }

  static confirm(title: string, text: string, onConfirm?: Function, onDeny?: Function) {
    Swal.fire({
      title: title,
      text: text,
      icon: "question",
      showDenyButton: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm && onConfirm();
      } else if (result.isDenied) {
        onDeny && onDeny();
      }
    });
  }
}