import { Component, computed, inject } from "@angular/core";
import { ContactForm } from "../../../../pages/contact/components/contact-form/contact-form";
import { AppStateService } from "../../../../state/app-state.service";

@Component({
  selector: "app-help",
  imports: [ContactForm],
  templateUrl: "./help.html",
})
export class Help {
  public readonly appState = inject(AppStateService);
  public readonly user = computed(() => this.appState.user());
}
