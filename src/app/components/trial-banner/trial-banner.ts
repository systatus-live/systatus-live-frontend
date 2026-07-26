import { Component, computed, input } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideTriangleAlert } from "@ng-icons/lucide";
import { RouterLink } from "@angular/router";
import { HlmAlertImports } from "../alert/src";

@Component({
  selector: "app-trial-banner",
  imports: [NgIcon, RouterLink, ...HlmAlertImports],
  providers: [provideIcons({ lucideTriangleAlert })],
  templateUrl: "./trial-banner.html",
  styleUrl: "./trial-banner.scss",
})
export class TrialBanner {
  readonly endDate = input<string>("");

  public readonly label = computed(() => {
    const end = new Date(this.endDate());
    const now = new Date();
    // Normaliza para meia-noite para comparar dias do calendário,
    // evitando que o arredondamento mostre 13 dias logo após criar a conta
    const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const daysLeft = Math.round((endMidnight.getTime() - nowMidnight.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) {
      return "Seu trial vence hoje";
    }

    if (daysLeft === 1) {
      return "Seu trial vence amanhã";
    }

    return `Seu trial vence em ${daysLeft} dias`;
  });
}
