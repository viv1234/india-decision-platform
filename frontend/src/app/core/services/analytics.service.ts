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
  public readonly trackingId = 'G-FPNCHWBTM3';
  private router = inject(Router);
  private lastTrackedUrl: string | null = null;
  private isInitialized = false;

  public init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Track page views on initial load and subsequent Angular Router navigations
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.trackPageView(event.urlAfterRedirects);
      });
  }

  public trackPageView(path: string, title?: string): void {
    if (!path) return;

    // Guard against duplicate pageview events for identical routes
    if (this.lastTrackedUrl === path) {
      return;
    }
    this.lastTrackedUrl = path;

    const pageTitle = title || (typeof document !== 'undefined' ? document.title : '');

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', this.trackingId, {
        page_path: path,
        page_title: pageTitle,
        page_location: window.location.href
      });

      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: pageTitle,
        send_to: this.trackingId
      });
    } else {
      console.log(`[GA4 Analytics Dev] Pageview -> ${path} | Title: "${pageTitle}" [${this.trackingId}]`);
    }
  }

  public trackEvent(eventName: string, params: Record<string, any> = {}): void {
    const sanitizedParams = this.sanitizeParams(params);

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        ...sanitizedParams,
        send_to: this.trackingId
      });
    } else {
      console.log(`[GA4 Analytics Dev] Event -> ${eventName}`, sanitizedParams);
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
      user_query: this.sanitizePiiText(query),
      intent_matched: intentMatched || 'UNKNOWN',
      category: 'AI Assistant'
    });
  }

  public trackCtaClick(ctaName: string, destination?: string): void {
    this.trackEvent('cta_click', {
      cta_name: ctaName,
      destination: destination || 'modal',
      category: 'User Interaction'
    });
  }

  private sanitizeParams(params: Record<string, any>): Record<string, any> {
    const clean: Record<string, any> = {};
    for (const key of Object.keys(params)) {
      const val = params[key];
      if (typeof val === 'string') {
        clean[key] = this.sanitizePiiText(val);
      } else {
        clean[key] = val;
      }
    }
    return clean;
  }

  private sanitizePiiText(text: string): string {
    if (!text) return '';
    // Redact emails and phone numbers to respect user privacy & WCAG/GDPR rules
    return text
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
      .replace(/(?:\+?\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/g, '[REDACTED_PHONE]');
  }
}


