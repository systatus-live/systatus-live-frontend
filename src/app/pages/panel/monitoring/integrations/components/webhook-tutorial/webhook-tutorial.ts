import { Component, signal } from "@angular/core";

@Component({
  selector: "app-webhook-tutorial",
  imports: [],
  templateUrl: "./webhook-tutorial.html",
  styleUrl: "./webhook-tutorial.scss",
})
export class WebhookTutorial {
  readonly isOpen = signal(false);
  readonly activeTab = signal<"slack" | "google-chat" | "mattermost" | "discord">("slack");

  readonly tabs = [
    { id: "slack" as const, label: "Slack", icon: "/logos/slack.svg" },
    { id: "google-chat" as const, label: "Google Chat", icon: "/logos/google-chat.svg" },
    { id: "mattermost" as const, label: "Mattermost", icon: "/logos/mattermost.svg" },
    { id: "discord" as const, label: "Discord", icon: "/logos/discord.svg" },
  ];
}
