import { Component, input } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
  selector: 'lib-success-state',
  imports: [LucideIconComponent],
  template: `
    <div class="success-state">
      <div class="icon-circle">
        <lib-lucide-icon name="check" [size]="32" color="#32D74B" />
      </div>
      <h2 class="title">{{ title() }}</h2>
      @if (description()) {
        <p class="description">{{ description() }}</p>
      }
      <div class="accent-line"></div>
    </div>
  `,
  styles: `
    .success-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .icon-circle {
      width: 64px;
      height: 64px;
      background: #32D74B15;
      border: 2px solid #32D74B30;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .title {
      font-family: 'Sora', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.5px;
      text-align: center;
      margin: 0;
    }
    .description {
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      font-weight: 400;
      color: #8A8A9A;
      line-height: 1.6;
      text-align: center;
      margin: 0;
    }
    .accent-line {
      width: 40px;
      height: 3px;
      background: #4F9CF7;
      border-radius: 2px;
    }
  `,
})
export class SuccessStateComponent {
  title = input<string>("You're in. Welcome to the community.");
  description = input<string>('');
}
