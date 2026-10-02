import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AiModalComponent } from './shared/components/ai-modal/ai-modal.component';
import { AnalyticsService } from './core/services/analytics.service';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AiModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'BharatDecision Platform';
  readonly showAiModal = signal<boolean>(false);

  private analyticsService = inject(AnalyticsService);
  private seoService = inject(SeoService);

  ngOnInit(): void {
    // Initialize GA4 tracking
    this.analyticsService.init();

    // Default SEO metadata initialization
    this.seoService.updateSeo({
      title: 'BharatDecision Platform',
      description: 'AI-powered India Decision Platform. Calculate EMI, SIP, FD, Salary CTC, GST, Fuel, Inflation and Rent Affordability to make smarter everyday financial choices.',
      keywords: 'India decision platform, EMI calculator, SIP calculator, FD calculator, Salary CTC calculator, GST calculator'
    });
  }
}

