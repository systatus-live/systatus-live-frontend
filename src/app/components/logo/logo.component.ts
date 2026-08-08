import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { HlmTooltipImports } from "@spartan-ng/helm/tooltip";

export type LogoSize = "small" | "normal" | "large";

@Component({
  selector: "app-logo",
  imports: [RouterLink, HlmTooltipImports],
  templateUrl: "./logo.component.html",
})
export class LogoComponent {
  readonly inverted = input(false);
  readonly iconOnly = input(false);
  readonly size = input<LogoSize>("normal");

  public get imgSize(): number {
    const map: Record<LogoSize, number> = { small: 14, normal: 22, large: 36 };
    return map[this.size()];
  }

  public get textClass(): string {
    const map: Record<LogoSize, string> = {
      small: "text-sm font-medium",
      normal: "text-xl font-semibold",
      large: "text-3xl font-bold",
    };
    return map[this.size()];
  }
}
