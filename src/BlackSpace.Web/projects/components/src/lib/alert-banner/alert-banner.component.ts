import { Component, input } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
  selector: 'lib-alert-banner',
  imports: [LucideIconComponent],
  template: `
    <div class="banner" [class]="'banner banner-' + type()">
      <lib-lucide-icon name="circle-alert" [size]="18" [color]="iconColor()" />
      <span class="message">{{ message() }}</span>
    </div>
  `,
  styles: `
    .banner {
      display: flex;
      align-items: center;
      gap: 10px;
      border-radius: 8px;
      padding: 12px 16px;
    }
    .banner-error {
      background: #FF3B3015;
      border: 1px solid #FF3B3040;
    }
    .banner-warning {
      background: #FF990020;
      border: 1px solid #FF990030;
    }
    .banner-info {
      background: #4F9CF710;
      border: 1px solid #4F9CF730;
    }
    .message {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
    }
    .banner-error .message {
      color: #FF3B30;
    }
    .banner-warning .message {
      color: #FF9900;
    }
    .banner-info .message {
      color: #4F9CF7;
    }
  `,
})
export class AlertBannerComponent {
  message = input.required<string>();
  type = input.required<'error' | 'warning' | 'info'>();

  iconColor(): string {
    switch (this.type()) {
      case 'error':
        return '#FF3B30';
      case 'warning':
        return '#FF9900';
      case 'info':
        return '#4F9CF7';
    }
  }
}
