import { Component, TemplateRef, contentChild, input, output, ViewChild, ElementRef, AfterViewInit, OnDestroy } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { HlmTableImports } from "../table/src";

@Component({
  selector: "app-table",
  imports: [NgTemplateOutlet, ...HlmTableImports],
  templateUrl: "./app-table.html",
  styleUrl: "./app-table.scss",
})
export class AppTable implements AfterViewInit, OnDestroy {
  public readonly columns = input<string[]>([]);
  public readonly rows = input<any[]>([]);
  public readonly emptyMessage = input("Nenhum registro encontrado.");
  public readonly total = input(0);
  public readonly hasMore = input(false);
  public readonly totalLabel = input("registros");
  public readonly maxHeight = input("calc(100svh - 180px)");
  public readonly loadMore = output<void>();

  public readonly rowTemplate = contentChild<TemplateRef<{ $implicit: any }>>("rowTemplate");

  @ViewChild("tableContainer", { static: true }) private tableContainer!: ElementRef<HTMLDivElement>;
  @ViewChild("sentinel", { static: true }) private sentinel!: ElementRef<HTMLDivElement>;
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.hasMore()) {
        this.loadMore.emit();
      }
    }, { root: this.tableContainer.nativeElement, threshold: 0 });
    this.observer.observe(this.sentinel.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.observer = null;
  }
}
