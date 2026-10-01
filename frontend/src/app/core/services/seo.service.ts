import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  routePath?: string;
  ogType?: string;
  ogImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly defaultTitle = 'BharatDecision Platform | Smart Everyday Financial Decisions';
  private readonly defaultDescription = 'AI-powered India Decision Platform. Calculate EMI, SIP, FD, Salary CTC, GST, Fuel, Inflation and Rent Affordability to make smarter everyday choices.';
  private readonly siteUrl = 'https://bharatdecision.com';

  constructor(private titleService: Title, private metaService: Meta) {}

  public updateSeo(config: Partial<SeoConfig>): void {
    const fullTitle = config.title ? `${config.title} | BharatDecision` : this.defaultTitle;
    const description = config.description || this.defaultDescription;
    const path = config.routePath || '';
    const fullUrl = `${this.siteUrl}${path}`;
    const keywords = config.keywords || 'India decision platform, EMI calculator, SIP calculator, FD calculator, Salary CTC calculator, GST calculator, Inflation calculator, Rent affordability';

    // 1. Update Title
    this.titleService.setTitle(fullTitle);

    // 2. Standard Meta Tags
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: keywords });

    // 3. Open Graph Metadata
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: fullUrl });
    this.metaService.updateTag({ property: 'og:type', content: config.ogType || 'website' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'BharatDecision' });
    this.metaService.updateTag({ property: 'og:image', content: config.ogImage || `${this.siteUrl}/favicon.svg` });

    // 4. Twitter Card Metadata
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: config.ogImage || `${this.siteUrl}/favicon.svg` });

    // 5. Canonical Link
    this.updateCanonicalUrl(fullUrl);
  }

  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
