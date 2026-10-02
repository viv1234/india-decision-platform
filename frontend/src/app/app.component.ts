import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AiModalComponent } from './shared/components/ai-modal/ai-modal.component';
import { AnalyticsService } from './core/services/analytics.service';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, AiModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'BharatDecision Platform';
  showAiModal = signal<boolean>(false);

  constructor(
    private analyticsService: AnalyticsService,
    private seoService: SeoService
  ) {}

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
