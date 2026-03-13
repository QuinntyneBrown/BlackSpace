import { Component, input, output } from '@angular/core';
import { ButtonPrimaryComponent } from '../button-primary/button-primary.component';
import { ButtonSecondaryComponent } from '../button-secondary/button-secondary.component';

@Component({
  selector: 'lib-cookie-banner',
  imports: [ButtonPrimaryComponent, ButtonSecondaryComponent],
  template: `
    <div class="cookie-banner">
      <p class="message">{{ message() }}</p>
      <div class="actions">
        <lib-button-primary label="Accept" (clicked)="accepted.emit()" />
        <lib-button-secondary label="Learn More" (clicked)="learnMore.emit()" />
      </div>
    </div>
  `,
  styles: `
    .cookie-banner {
      background: #0D0E18;
      border: 1px solid #1A1A2E;
      border-radius: 12px;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .message {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #8A8A9A;
      margin: 0;
      flex: 1;
    }
    .actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
    .actions ::ng-deep button {
      padding: 10px 20px;
      font-size: 14px;
    }
  `,
})
export class CookieBannerComponent {
  message = input<string>(
    'We use analytics to improve your experience. No personal data is sold.'
  );

  accepted = output<void>();
  learnMore = output<void>();
}
