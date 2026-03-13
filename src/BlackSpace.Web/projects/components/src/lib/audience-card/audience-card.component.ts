import { Component, input } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
  selector: 'lib-audience-card',
  imports: [LucideIconComponent],
  templateUrl: './audience-card.component.html',
  styleUrl: './audience-card.component.scss',
})
export class AudienceCardComponent {
  iconName = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}
