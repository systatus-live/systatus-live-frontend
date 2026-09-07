// Equivalente: ng g directive directives/reveal
import { Directive, ElementRef, Input, OnDestroy, OnInit, PLATFORM_ID, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Directive({
  selector: "[appReveal]",
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input() appReveal = 0;

  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  public ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const el = this.el.nativeElement as HTMLElement;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, this.appReveal);
          this.observer?.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    this.observer.observe(el);
  }

  public ngOnDestroy() {
    this.observer?.disconnect();
  }
}
