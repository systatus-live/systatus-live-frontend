import { Component, inject, input } from "@angular/core";
import { Router } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideChevronsLeft, lucideChevronLeft, lucideChevronRight, lucideChevronsRight } from "@ng-icons/lucide";
import { HlmTooltipImports } from "@spartan-ng/helm/tooltip";
import { HlmButton } from "../button/src";
import { NavigatorState } from "../../services/navigator-state";

@Component({
  selector: "app-navigator",
  imports: [NgIcon, HlmButton, HlmTooltipImports],
  host: {
    "[style.display]": "isVisible ? '' : 'none'"
  },
  providers: [provideIcons({ lucideChevronsLeft, lucideChevronLeft, lucideChevronRight, lucideChevronsRight })],
  templateUrl: "./app-navigator.html",
})
export class AppNavigator {
  public readonly currentId = input<string>("");
  public readonly routeBase = input<string>("");

  private readonly navigatorState = inject(NavigatorState);
  private readonly router = inject(Router);

  private get ids(): string[] {
    return this.navigatorState.ids();
  }

  private get currentIndex(): number {
    return this.ids.findIndex(id => id == this.currentId());
  }

  public get hasPrev(): boolean {
    return this.currentIndex > 0;
  }

  public get hasNext(): boolean {
    const idx = this.currentIndex;
    return idx !== -1 && idx + 1 < this.ids.length;
  }

  public get isVisible(): boolean {
    return (
      this.navigatorState.routeBase() === this.routeBase() &&
      this.ids.length > 1 &&
      this.currentIndex !== -1
    );
  }

  private go(id: string): void {
    this.router.navigate([this.routeBase(), id]);
  }

  public first(): void {
    if (this.ids.length > 0) {
      this.go(this.ids[0]);
    }
  }

  public prev(): void {
    const idx = this.currentIndex;
    if (idx > 0) {
      this.go(this.ids[idx - 1]);
    }
  }

  public next(): void {
    const idx = this.currentIndex;
    if (idx !== -1 && idx + 1 < this.ids.length) {
      this.go(this.ids[idx + 1]);
    }
  }

  public last(): void {
    if (this.ids.length > 0) {
      this.go(this.ids[this.ids.length - 1]);
    }
  }
}
