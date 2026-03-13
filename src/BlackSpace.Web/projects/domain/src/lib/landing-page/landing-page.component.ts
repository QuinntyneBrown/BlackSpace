import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  SectionHeaderComponent,
  AudienceCardComponent,
  PillarCardComponent,
  ButtonPrimaryComponent,
  ButtonSecondaryComponent,
  LucideIconComponent,
} from 'components';
import { ContentService, ContentStats } from 'api';

import { SignupFormContainerComponent } from '../signup-form-container/signup-form-container.component';
import { NavigationContainerComponent } from '../navigation-container/navigation-container.component';
import { CookieConsentManagerComponent } from '../cookie-consent-manager/cookie-consent-manager.component';

@Component({
  selector: 'lib-landing-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SectionHeaderComponent,
    AudienceCardComponent,
    PillarCardComponent,
    ButtonPrimaryComponent,
    ButtonSecondaryComponent,
    LucideIconComponent,
    SignupFormContainerComponent,
    NavigationContainerComponent,
    CookieConsentManagerComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  private readonly contentService = inject(ContentService);

  readonly stats = signal<ContentStats | null>(null);

  ngOnInit(): void {
    this.contentService.getStats().subscribe({
      next: (data) => this.stats.set(data),
    });
  }

  statNumber(): string {
    return '12,000+';
  }

  scrollToJoin(): void {
    document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToAbout(): void {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }

  onFooterNav(event: Event, section: string): void {
    event.preventDefault();
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
}
