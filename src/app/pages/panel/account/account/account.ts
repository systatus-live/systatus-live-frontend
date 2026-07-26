import { Component, inject } from "@angular/core";
import { RouterLink, RouterOutlet, Router, NavigationEnd } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideUser, lucideCreditCard } from "@ng-icons/lucide";
import { filter, map, startWith } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-account",
  imports: [RouterLink, RouterOutlet, NgIcon],
  providers: [provideIcons({ lucideUser, lucideCreditCard })],
  templateUrl: "./account.html",
  styleUrl: "./account.scss",
})
export class Account {
  private readonly router = inject(Router);

  public readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  public readonly navList = [
    { icon: "lucideUser", label: "Detalhes", url: "/panel/account/details" },
    { icon: "lucideCreditCard", label: "Assinatura", url: "/panel/account/subscription" },
  ];

  public get activeLabel(): string {
    return this.navList.find(i => this.currentUrl().startsWith(i.url))?.label ?? "Conta";
  }
}
