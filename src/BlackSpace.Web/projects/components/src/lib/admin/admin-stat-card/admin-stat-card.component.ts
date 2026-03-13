import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-admin-stat-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './admin-stat-card.component.html',
  styleUrl: './admin-stat-card.component.scss',
})
export class AdminStatCardComponent {
  icon = input.required<string>();
  label = input.required<string>();
  value = input.required<string>();
  color = input<'primary' | 'accent' | 'warn'>('primary');
}
