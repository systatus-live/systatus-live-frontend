import { Component, Type } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import {
  LucideGlobe,
  LucideBell,
  LucideClock,
  LucideAlertTriangle,
  LucideLayoutDashboard,
  LucideBarChart2,
} from '@lucide/angular';
import { HlmButton } from '../../../../components/button/src';

interface Feature {
  name: string;
  description: string;
  icon: Type<any>;
  colorClass: string;
  glowClass: string;
}

@Component({
  selector: 'app-features',
  imports: [RouterLink, NgComponentOutlet, HlmButton],
  templateUrl: './features.component.html',
})
export class FeaturesComponent {
  public readonly featureList: Feature[] = [
    {
      name: 'Monitoramento Contínuo',
      description: 'Sites, APIs e servidores verificados a cada 60 segundos. Você descobre a falha antes que o usuário tente acessar.',
      icon: LucideGlobe,
      colorClass: 'bg-blue-500/15 text-blue-400',
      glowClass: 'group-hover:shadow-blue-500/20',
    },
    {
      name: 'Alertas Instantâneos',
      description: 'A notificação chega no Slack, WhatsApp, Discord ou e-mail. Sem precisar abrir dashboard para saber se está tudo bem.',
      icon: LucideBell,
      colorClass: 'bg-red-500/15 text-red-400',
      glowClass: 'group-hover:shadow-red-500/20',
    },
    {
      name: 'Histórico de 30 Dias',
      description: 'Identifique padrões de instabilidade e chegue em reuniões com dados.',
      icon: LucideClock,
      colorClass: 'bg-emerald-500/15 text-emerald-400',
      glowClass: 'group-hover:shadow-emerald-500/20',
    },
    {
      name: 'Gestão de Incidentes',
      description: 'Registre, acompanhe e encerre incidentes com linha do tempo completa. Ideal para post-mortems e relatórios de SLA.',
      icon: LucideAlertTriangle,
      colorClass: 'bg-amber-500/15 text-amber-400',
      glowClass: 'group-hover:shadow-amber-500/20',
    },
    {
      name: 'Página de Status Pública',
      description: 'Publique o status dos seus serviços em tempo real. Clientes ficam informados e o suporte recebe menos tickets.',
      icon: LucideLayoutDashboard,
      colorClass: 'bg-purple-500/15 text-purple-400',
      glowClass: 'group-hover:shadow-purple-500/20',
    },
    {
      name: 'Análise de Desempenho',
      description: 'Detecte lentidão antes que o usuário perceba. Tempo de resposta ao longo do tempo, tudo em um só lugar.',
      icon: LucideBarChart2,
      colorClass: 'bg-indigo-500/15 text-indigo-400',
      glowClass: 'group-hover:shadow-indigo-500/20',
    },
  ];
}
