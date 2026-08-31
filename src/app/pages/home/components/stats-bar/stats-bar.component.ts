import { Component } from '@angular/core';

@Component({
  selector: 'app-stats-bar',
  templateUrl: './stats-bar.component.html',
})
export class StatsBarComponent {
  public readonly statList = [
    { value: '+100 mil', label: 'Chamadas monitoradas/dia' },
    { value: '< 1s', label: 'Tempo de resposta médio' },
    { value: '< 30s', label: 'Tempo máximo de alerta' },
    { value: '0', label: 'Instalações necessárias' },
  ];
}
