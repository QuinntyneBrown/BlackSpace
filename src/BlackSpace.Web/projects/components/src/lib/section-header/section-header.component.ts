import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-section-header',
  template: `
    <div class="section-header">
      <span class="label">{{ label() }}</span>
      <h2 class="headline" [style.font-size]="headlineSize()">{{ headline() }}</h2>
      @if (subtext()) {
        <p class="subtext">{{ subtext() }}</p>
      }
    </div>
  `,
  styles: `
    .section-header {
      text-align: center;
    }
    .label {
      display: block;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 700;
      color: #4F9CF7;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .headline {
      font-family: 'Sora', sans-serif;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -1.5px;
      margin: 0 0 16px 0;
    }
    .subtext {
      font-family: 'Inter', sans-serif;
      font-size: 19px;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 1.6;
      margin: 0;
    }
  `,
})
export class SectionHeaderComponent {
  label = input.required<string>();
  headline = input.required<string>();
  subtext = input<string>('');
  headlineSize = input<string>('40px');
}
