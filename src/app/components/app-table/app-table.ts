import { Component, TemplateRef, contentChild, input, output, inject, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit, OnDestroy, effect } from "@angular/core";
import { isPlatformBrowser, NgTemplateOutlet } from "@angular/common";
import { HlmTableImports } from "../table/src";

@Component({
  selector: "app-table",
  imports: [NgTemplateOutlet, ...HlmTableImports],
  templateUrl: "./app-table.html",
  styleUrl: "./app-table.scss",
})
export class AppTable implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  public readonly columns = input<string[]>([]);
  public readonly rows = input<any[]>([]);
  public readonly emptyMessage = input("Nenhum registro encontrado.");
  public readonly total = input(0);
  public readonly hasMore = input(false);
  public readonly totalLabel = input("registros");
  public readonly loadMore = output<void>();

  public readonly rowTemplate = contentChild<TemplateRef<{ $implicit: any }>>("rowTemplate");

  @ViewChild("sentinel", { static: true }) private sentinel!: ElementRef<HTMLDivElement>;
  private observer: IntersectionObserver | null = null;

  constructor() {
    effect(() => {
      this.rows();
      if (isPlatformBrowser(this.platformId)) {
        this.setupObserver();
      }
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupObserver();
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.observer = null;
  }

  private setupObserver() {
    if (!this.sentinel?.nativeElement) {
      return;
    }

    this.observer?.disconnect();
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.hasMore()) {
        this.loadMore.emit();
      }
    }, { threshold: 0 });
    this.observer.observe(this.sentinel.nativeElement);
  }
}
