import { Component, input, output } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideSun, lucideMoon } from "@ng-icons/lucide";
import { HlmSwitchImports } from "../switch/src";

@Component({
  selector: "app-theme-toggle",
  imports: [NgIcon, ...HlmSwitchImports],
  providers: [provideIcons({ lucideSun, lucideMoon })],
  templateUrl: "./theme-toggle.html",
  styleUrl: "./theme-toggle.scss",
})
export class ThemeToggle {
  readonly isDark = input<boolean>(false);
  readonly toggle = output<boolean>();
}
