import { Component, signal } from '@angular/core';
import {
  LucideSettings,
  LucideBell,
  LucideAlertTriangle,
  LucideCheck,
} from '@lucide/angular';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

type TabId = 'config' | 'notifications' | 'incidents';

interface Incident {
  title: string;
  status: 'investigating' | 'resolved';
  info: string;
}

@Component({
  selector: 'app-demo-tabs',
  imports: [
    LucideSettings, 
    LucideBell, 
    LucideAlertTriangle, 
    LucideCheck,
    HlmTooltipImports
  ],
  templateUrl: './demo-tabs.component.html',
})
export class DemoTabsComponent {
  public readonly activeTab = signal<TabId>('config');

  public readonly tabs: { id: TabId; label: string }[] = [
    { id: 'config', label: 'Configuração' },
    { id: 'notifications', label: 'Notificações' },
    { id: 'incidents', label: 'Incidentes' },
  ];

  public readonly channelList = [
    { name: 'Slack', logo: '/logos/slack.svg', status: 'Conectado', active: true },
    { name: 'WhatsApp', logo: '/logos/whatsapp.svg', status: 'Conectado', active: true },
    { name: 'Discord', logo: '/logos/discord.svg', status: 'Conectado', active: true },
    { name: 'E-mail', logo: '/logos/mail.svg', status: '', active: false },
    { name: 'Google Chat', logo: '/logos/google-chat.svg', status: '', active: false },
    { name: 'Mattermost', logo: '/logos/mattermost.svg' },
  ];

  public readonly incidentList: Incident[] = [
    {
      title: 'Não encontrado api.service.com',
      status: 'investigating',
      info: 'Iniciado há 14 min',
    },
    {
      title: 'Timeout em payments.service.io',
      status: 'resolved',
      info: 'Duração: 23 min',
    },
    {
      title: 'Indisponibilidade em website.com',
      status: 'resolved',
      info: 'Duração: 7 min',
    },
  ];

  public setTab(id: TabId) {
    this.activeTab.set(id);
  }
}
