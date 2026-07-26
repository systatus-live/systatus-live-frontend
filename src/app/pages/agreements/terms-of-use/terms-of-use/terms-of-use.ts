import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LogoComponent } from "../../../../components/logo/logo.component";

@Component({
  selector: "app-terms-of-use",
  imports: [RouterLink, LogoComponent],
  templateUrl: "./terms-of-use.html",
  styleUrl: "./terms-of-use.scss",
})
export class TermsOfUse {
  public readonly supportMail = "systatus@artcode.dev";
}
