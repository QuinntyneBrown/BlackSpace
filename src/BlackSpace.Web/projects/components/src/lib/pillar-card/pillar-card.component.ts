import { Component, input } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
  selector: 'lib-pillar-card',
  imports: [LucideIconComponent],
  template: `
    <div class="card">
      <div class="icon-container">
        <lib-lucide-icon [name]="iconName()" [size]="24" color="#4F9CF7" />
      </div>
      <h3 class="title">{{ title() }}</h3>
      <p class="description">{{ description() }}</p>
    </div>
  `,
  styles: `
    .card {
      background: #0F1019;
      border: 1px solid #1A1A2E;
      border-radius: 12px;
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .icon-container {
      width: 48px;
      height: 48px;
      background: #4F9CF720;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .title {
      font-family: 'Sora', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .description {
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      font-weight: 400;
      color: #8A8A9A;
      line-height: 1.6;
      margin: 0;
    }
  `,
})
export class PillarCardComponent {
  iconName = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}
