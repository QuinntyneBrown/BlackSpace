import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'lib-section-header',
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss',
})
export class SectionHeaderComponent {
  label = input.required<string>();
  headline = input.required<string>();
  subtext = input<string>('');
  headlineSize = input<string>('40px');

  formattedHeadline = computed(() => this.headline().replace(/\\n|\n/g, '<br>'));
}
