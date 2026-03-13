import { Component, input } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
  selector: 'lib-success-state',
  imports: [LucideIconComponent],
  templateUrl: './success-state.component.html',
  styleUrl: './success-state.component.scss',
})
export class SuccessStateComponent {
  title = input<string>("You're in. Welcome to the community.");
  description = input<string>('');
}
