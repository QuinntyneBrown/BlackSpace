import {
  Component,
  signal,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieBannerComponent } from 'components';

@Component({
  selector: 'lib-cookie-consent-manager',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CookieBannerComponent],
  templateUrl: './cookie-consent-manager.component.html',
  styleUrl: './cookie-consent-manager.component.scss',
})
export class CookieConsentManagerComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  readonly showBanner = signal(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) {
        this.showBanner.set(true);
      }
    }
  }

  onAccept(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cookie-consent', 'accepted');
    }
    this.showBanner.set(false);
  }

  onLearnMore(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.open('https://blackspace.ca/privacy', '_blank');
    }
  }
}
