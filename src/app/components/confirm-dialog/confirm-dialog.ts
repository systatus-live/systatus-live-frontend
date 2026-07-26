import { Component, inject, OnInit } from "@angular/core";
import { HlmButton } from "../button/src";
import { Confirm } from "../../services/confirm";
import { registerAlertConfirm } from "../../lib/alert";

@Component({
  selector: "app-confirm-dialog",
  imports: [HlmButton],
  templateUrl: "./confirm-dialog.html",
  styleUrl: "./confirm-dialog.scss",
})
export class ConfirmDialog implements OnInit {
  public readonly confirmService = inject(Confirm);

  ngOnInit() {
    registerAlertConfirm((title, text, onConfirm, onDeny) => {
      this.confirmService.show(title, text, onConfirm, onDeny);
    });
  }
}
