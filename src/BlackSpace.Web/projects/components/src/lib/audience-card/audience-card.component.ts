import { Component, input } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
  selector: 'lib-audience-card',
  imports: [LucideIconComponent],
  template: `
    <div class="card">
      <lib-lucide-icon [name]="iconName()" [size]="28" color="#4F9CF7" />
      <h3 class="title">{{ title() }}</h3>
      <p class="description">{{ description() }}</p>
    </div>
  `,
  styles: `
    .card {
      background: #0F1019;
      border: 1px solid #1A1A2E;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .title {
      font-family: 'Sora', sans-serif;
      font-size: 17px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0;
    }
    .description {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #8A8A9A;
      line-height: 1.5;
      margin: 0;
    }
  `,
})
export class AudienceCardComponent {
  iconName = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}
