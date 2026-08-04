import { Component, TemplateRef, contentChild, input, output } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { HlmButton } from "../button/src";
import { HlmTableImports } from "../table/src";

@Component({
  selector: "app-table",
  imports: [NgTemplateOutlet, HlmButton, ...HlmTableImports],
  templateUrl: "./app-table.html",
  styleUrl: "./app-table.scss",
})
export class AppTable {
  public readonly columns = input<string[]>([]);
  public readonly rows = input<any[]>([]);
  public readonly emptyMessage = input("Nenhum registro encontrado.");
  public readonly total = input(0);
  public readonly page = input(0);
  public readonly totalPages = input(0);
  public readonly totalLabel = input("registros");
  public readonly pageChange = output<number>();

  public readonly rowTemplate = contentChild<TemplateRef<{ $implicit: any }>>("rowTemplate");
}
