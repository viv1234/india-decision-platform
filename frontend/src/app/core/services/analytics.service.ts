import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private trackingId = 'G-BHARATDEC'; // Replace with production GA4 Measurement ID if needed
  private router = inject(Router);

  public init(): void {
    // Automatically track page views on route changes
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.trackPageView(event.urlAfterRedirects);
      });
  }

  public trackPageView(path: string, title?: string): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', this.trackingId, {
        page_path: path,
        page_title: title || document.title
      });
    } else {
      console.log(`[Analytics Dev Mode] Pageview: ${path} (${title || document.title})`);
    }
  }

  public trackEvent(eventName: string, params: Record<string, any> = {}): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
    } else {
      console.log(`[Analytics Dev Mode] Event: ${eventName}`, params);
    }
  }

  public trackCalculatorUsage(calculatorId: string, calculatorName: string, inputsSummary?: string): void {
    this.trackEvent('calculator_used', {
      calculator_id: calculatorId,
      calculator_name: calculatorName,
      inputs_summary: inputsSummary || 'default',
      category: 'Financial Tools'
    });
  }

  public trackAiQuery(query: string, intentMatched?: string): void {
    this.trackEvent('ai_assistant_used', {
      user_query: query,
      intent_matched: intentMatched || 'UNKNOWN',
      category: 'AI Assistant'
    });
  }
}

