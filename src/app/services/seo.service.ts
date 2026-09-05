import { inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Meta, Title } from "@angular/platform-browser";

export interface PageSeoConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  structuredData?: Record<string, unknown>;
}

const BASE_URL = "https://systatus.live";
const DEFAULT_IMAGE = `${BASE_URL}/logos/systatus-live.png`;

@Injectable({ providedIn: "root" })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  update(config: PageSeoConfig): void {
    const canonical = config.canonical ?? BASE_URL;
    const ogImage = config.ogImage ?? DEFAULT_IMAGE;
    const ogType = config.ogType ?? "website";
    const robots = config.noindex ? "noindex, nofollow" : "index, follow";

    this.title.setTitle(config.title);

    // Standard
    this.meta.updateTag({ name: "description", content: config.description });
    this.meta.updateTag({ name: "robots", content: robots });
    if (config.keywords) {
      this.meta.updateTag({ name: "keywords", content: config.keywords });
    }

    // Open Graph (Facebook / LinkedIn)
    this.meta.updateTag({ property: "og:title", content: config.title });
    this.meta.updateTag({ property: "og:description", content: config.description });
    this.meta.updateTag({ property: "og:url", content: canonical });
    this.meta.updateTag({ property: "og:type", content: ogType });
    this.meta.updateTag({ property: "og:image", content: ogImage });
    this.meta.updateTag({ property: "og:site_name", content: "Systatus.Live" });
    this.meta.updateTag({ property: "og:locale", content: "pt_BR" });

    // Twitter Card
    this.meta.updateTag({ name: "twitter:card", content: "summary_large_image" });
    this.meta.updateTag({ name: "twitter:title", content: config.title });
    this.meta.updateTag({ name: "twitter:description", content: config.description });
    this.meta.updateTag({ name: "twitter:image", content: ogImage });
    this.meta.updateTag({ property: "twitter:domain", content: "systatus.live" });
    this.meta.updateTag({ property: "twitter:url", content: canonical });

    this.setCanonical(canonical);

    if (config.structuredData) {
      this.setStructuredData(config.structuredData);
    }
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement("link");
      link.setAttribute("rel", "canonical");
      this.document.head.appendChild(link);
    }
    link.setAttribute("href", url);
  }

  private setStructuredData(data: Record<string, unknown>): void {
    const id = "ld-json-main";
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement("script");
      script.id = id;
      script.setAttribute("type", "application/ld+json");
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
