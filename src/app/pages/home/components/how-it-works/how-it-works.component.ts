import { Component, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import {
  LucidePlusCircle,
  LucideShieldCheck,
  LucideBellRing,
} from '@lucide/angular';

interface Step {
  icon: Type<any>;
  color: string;
  step: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-how-it-works',
  imports: [NgComponentOutlet],
  templateUrl: './how-it-works.component.html',
})
export class HowItWorksComponent {
  public readonly steps: Step[] = [
    {
      icon: LucidePlusCircle,
      color: 'bg-blue-500',
      step: '01',
      title: 'Cadastre seu endpoint',
      description: 'Informe a URL do seu site, API ou servidor. Nenhum agente para instalar, só cole o endereço e pronto.',
    },
    {
      icon: LucideShieldCheck,
      color: 'bg-indigo-500',
      step: '02',
      title: 'Monitoramos continuamente',
      description: 'Verificamos sua aplicação a cada 60 segundos a partir de múltiplas regiões para eliminar falsos positivos.',
    },
    {
      icon: LucideBellRing,
      color: 'bg-green-500',
      step: '03',
      title: 'Você recebe o alerta',
      description: 'Em menos de 30 segundos após a detecção, você é notificado no Slack, WhatsApp, Discord, e-mail ou Google Chat.',
    },
  ];
}
