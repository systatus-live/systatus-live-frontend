import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "appDecimal",
})
export class AppDecimalPipe implements PipeTransform {
  transform(value: number, decimals = 2): string {
    return new Intl.NumberFormat("pt-BR", {
      useGrouping: false,
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    }).format(value);
  }
}
