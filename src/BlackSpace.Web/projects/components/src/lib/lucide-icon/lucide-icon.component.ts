import { Component, input, computed } from '@angular/core';

const ICON_PATHS: Record<string, string> = {
  code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  cpu: 'M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM9 9h6v6H9z',
  'graduation-cap':
    'M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0zM22 10v6M6 12.5v4.5c0 1.657 2.686 3 6 3s6-1.343 6-3v-4.5',
  rocket:
    'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3M22 2l-7.5 7.5M9.5 11.5L2 22l10.5-7.5M15 9l-1.5 1.5M22 2l-7.5 7.5M6.5 12.4 12 7.9',
  'flask-conical':
    'M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2M8.5 2h7M7 16.5h10',
  network:
    'M6 9a6 6 0 0 1 12 0c0 3.5-2 5-2 8h-8c0-3-2-4.5-2-8zM9 17v1a3 3 0 0 0 6 0v-1',
  eye: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  'git-branch':
    'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9',
  check: 'M20 6L9 17l-5-5',
  'circle-alert': 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8v4M12 16h.01',
  'triangle-alert':
    'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  x: 'M18 6L6 18M6 6l12 12',
  menu: 'M4 12h16M4 6h16M4 18h16',
  linkedin:
    'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  mail: 'M22 5H2v14h20V5zM2 5l10 7 10-7',
  'chevron-down': 'M6 9l6 6 6-6',
};

@Component({
  selector: 'lib-lucide-icon',
  templateUrl: './lucide-icon.component.html',
  styleUrl: './lucide-icon.component.scss',
})
export class LucideIconComponent {
  name = input.required<string>();
  size = input<number>(24);
  color = input<string>('currentColor');

  pathData = computed(() => ICON_PATHS[this.name()] ?? '');
}
