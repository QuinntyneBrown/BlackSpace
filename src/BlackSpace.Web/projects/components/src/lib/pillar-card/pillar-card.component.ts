import { Component, input } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
  selector: 'lib-pillar-card',
  imports: [LucideIconComponent],
  templateUrl: './pillar-card.component.html',
  styleUrl: './pillar-card.component.scss',
})
export class PillarCardComponent {
  iconName = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}
