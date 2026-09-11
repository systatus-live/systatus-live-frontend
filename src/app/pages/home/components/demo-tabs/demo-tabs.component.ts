import { Component } from '@angular/core';
import { LucideCheck } from '@lucide/angular';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { RevealDirective } from '../../../../directives/reveal.directive';

@Component({
  selector: 'app-demo-tabs',
  imports: [HlmTooltipImports, RevealDirective],
  templateUrl: './demo-tabs.component.html',
})
export class DemoTabsComponent {
  public readonly channelList = [
    { name: 'Slack', logo: '/logos/slack.svg' },
    { name: 'WhatsApp', logo: '/logos/whatsapp.svg' },
    { name: 'Google Chat', logo: '/logos/google-chat.svg' },
    { name: 'Microsoft Teams', logo: '/logos/microsoft-teams.svg' },
    { name: 'Discord', logo: '/logos/discord.svg' },
    { name: 'Mattermost', logo: '/logos/mattermost.svg' },
    { name: 'E-mail', logo: '/logos/mail.svg' },
  ];
}
