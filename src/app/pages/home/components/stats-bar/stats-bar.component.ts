import { Component } from '@angular/core';

@Component({
  selector: 'app-stats-bar',
  templateUrl: './stats-bar.component.html',
})
export class StatsBarComponent {
  public readonly statList = [
    { value: '+10.000', label: 'Chamadas monitoradas/dia' },
    { value: '99.99%', label: 'Precisão de detecção' },
    { value: '< 1s', label: 'Tempo de resposta médio' },
    { value: '30s', label: 'Tempo máximo de alerta' },
  ];
}
