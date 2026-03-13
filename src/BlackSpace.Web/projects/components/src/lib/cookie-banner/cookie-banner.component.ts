import { Component, input, output } from '@angular/core';
import { ButtonPrimaryComponent } from '../button-primary/button-primary.component';
import { ButtonSecondaryComponent } from '../button-secondary/button-secondary.component';

@Component({
  selector: 'lib-cookie-banner',
  imports: [ButtonPrimaryComponent, ButtonSecondaryComponent],
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.scss',
})
export class CookieBannerComponent {
  message = input<string>(
    'We use analytics to improve your experience. No personal data is sold.'
  );

  accepted = output<void>();
  learnMore = output<void>();
}
