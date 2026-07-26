import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LogoComponent } from "../../../../components/logo/logo.component";

@Component({
  selector: "app-privacy-policy",
  imports: [RouterLink, LogoComponent],
  templateUrl: "./privacy-policy.html",
  styleUrl: "./privacy-policy.scss",
})
export class PrivacyPolicy {
  public readonly supportMail = "systatus@artcode.dev";
}
