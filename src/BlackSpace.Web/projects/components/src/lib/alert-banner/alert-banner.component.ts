import { Component, input } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
  selector: 'lib-alert-banner',
  imports: [LucideIconComponent],
  templateUrl: './alert-banner.component.html',
  styleUrl: './alert-banner.component.scss',
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
