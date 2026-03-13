import { Component, input, output } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';
import { ButtonPrimaryComponent } from '../button-primary/button-primary.component';

export interface MenuLink {
  label: string;
  section: string;
  hideTablet?: boolean;
}

@Component({
  selector: 'lib-mobile-menu-overlay',
  imports: [LucideIconComponent, ButtonPrimaryComponent],
  templateUrl: './mobile-menu-overlay.component.html',
  styleUrl: './mobile-menu-overlay.component.scss',
})
export class MobileMenuOverlayComponent {
  isOpen = input<boolean>(false);
  links = input<MenuLink[]>([]);

  closed = output<void>();
  navigate = output<string>();

  onNavigate(section: string): void {
    this.navigate.emit(section);
  }
}
