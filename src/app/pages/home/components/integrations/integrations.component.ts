import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '../../../../components/button/src';

interface Integration {
  name: string;
  logo: string;
  description: string;
}

@Component({
  selector: 'app-integrations',
  imports: [RouterLink, HlmButton],
  templateUrl: './integrations.component.html',
})
export class IntegrationsComponent {
  public readonly integrations: Integration[] = [
    {
      name: 'Slack',
      logo: '/logos/slack.svg',
      description: 'Receba alertas instantâneos diretamente nos seus canais do Slack.',
    },
    {
      name: 'Google Chat',
      logo: '/logos/google-chat.svg',
      description: 'Acompanhe a disponibilidade dos sistemas via mensagens no Google Chat.',
    },
    {
      name: 'E-mail',
      logo: '/logos/mail.svg',
      description: 'Receba notificações imediatas por e-mail assim que houver indisponibilidade.',
    },
    {
      name: 'WhatsApp',
      logo: '/logos/whatsapp.svg',
      description: 'Tenha alertas em tempo real no seu WhatsApp, onde quer que esteja.',
    },
    {
      name: 'Discord',
      logo: '/logos/discord.svg',
      description: 'Seja notificado em tempo real no seu servidor do Discord.',
    },
  ];
}
