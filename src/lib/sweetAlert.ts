import Swal from "sweetalert2";

export class SweetAlert {
  static success(title: string, text: string, timer = 3000) {
    Swal.fire({
      title: title,
      text: text,
      icon: "success",
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
      showCloseButton: true
    })
  }

  static error(title: string, text: string, timer = 3000) {
    Swal.fire({
      title: title,
      text: text,
      icon: "error",
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
      showCloseButton: true
    })
  }
}