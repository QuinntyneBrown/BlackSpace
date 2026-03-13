import { Component, input, output } from '@angular/core';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';
import { ButtonPrimaryComponent } from '../button-primary/button-primary.component';

export interface MenuLink {
  label: string;
  section: string;
}

@Component({
  selector: 'lib-mobile-menu-overlay',
  imports: [LucideIconComponent, ButtonPrimaryComponent],
  template: `
    @if (isOpen()) {
      <div class="overlay">
        <div class="top-bar">
          <span class="logo">BLACK SPACE</span>
          <button class="close-btn" (click)="closed.emit()">
            <lib-lucide-icon name="x" [size]="24" color="#FFFFFF" />
          </button>
        </div>
        <nav class="nav-links">
          @for (link of links(); track link.section) {
            <a class="nav-link" (click)="onNavigate(link.section)">{{ link.label }}</a>
          }
        </nav>
        <div class="bottom-cta">
          <lib-button-primary label="Join the Community" (clicked)="onNavigate('join')" />
        </div>
      </div>
    }
  `,
  styles: `
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      max-width: 375px;
      height: 100vh;
      background: #07080FF5;
      display: flex;
      flex-direction: column;
      z-index: 1000;
    }
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
    }
    .logo {
      font-family: 'Sora', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: 1.5px;
    }
    .close-btn {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nav-links {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .nav-link {
      padding: 20px 24px;
      font-family: 'Inter', sans-serif;
      font-size: 18px;
      font-weight: 500;
      color: #FFFFFF;
      border-bottom: 1px solid #FFFFFF08;
      cursor: pointer;
      text-decoration: none;
    }
    .nav-link:hover {
      opacity: 0.8;
    }
    .bottom-cta {
      padding: 24px;
    }
    .bottom-cta ::ng-deep lib-button-primary {
      display: block;
      width: 100%;
    }
    .bottom-cta ::ng-deep button {
      width: 100%;
      justify-content: center;
    }
  `,
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
