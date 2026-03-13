import {
  Component,
  signal,
  inject,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
  output,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import {
  ButtonPrimaryComponent,
  MobileMenuOverlayComponent,
  LucideIconComponent,
} from 'components';
import type { MenuLink } from 'components';

@Component({
  selector: 'lib-navigation-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonPrimaryComponent,
    MobileMenuOverlayComponent,
    LucideIconComponent,
  ],
  template: `
    <nav
      class="navbar"
      [style.background-color]="'rgba(7, 8, 15, ' + scrollOpacity() + ')'"
    >
      <div class="nav-inner">
        <a class="logo" href="#" (click)="scrollToTop($event)">
          <span class="logo-full">BLACK SPACE CANADA</span>
          <span class="logo-short">BLACK SPACE</span>
        </a>

        <div class="nav-links">
          @for (link of menuLinks; track link.section) {
            <a
              class="nav-link"
              [href]="'#' + link.section"
              (click)="onNavigate($event, link.section)"
            >{{ link.label }}</a>
          }
          <lib-button-primary label="Join" (clicked)="onJoinClick()" />
        </div>

        <button class="hamburger" (click)="toggleMobileMenu()" aria-label="Open menu">
          <lib-lucide-icon name="menu" [size]="24" color="#FFFFFF" />
        </button>
      </div>
    </nav>

    <lib-mobile-menu-overlay
      [isOpen]="mobileMenuOpen()"
      [links]="menuLinks"
      (closed)="closeMobileMenu()"
      (navigate)="onMobileNavigate($event)"
    />
  `,
  styles: `
    :host {
      display: block;
    }
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      transition: background-color 0.3s ease;
    }
    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: 0.15em;
      color: #FFFFFF;
      text-decoration: none;
    }
    .logo-short {
      display: none;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    .nav-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }
    .nav-link:hover {
      color: #FFFFFF;
    }
    .hamburger {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
    }
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
      .hamburger {
        display: flex;
      }
      .logo-full {
        display: none;
      }
      .logo-short {
        display: inline;
      }
    }
  `,
})
export class NavigationContainerComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  readonly joinClicked = output<void>();

  readonly mobileMenuOpen = signal(false);
  readonly scrollOpacity = signal(0.5);

  private scrollHandler: (() => void) | null = null;

  readonly menuLinks: MenuLink[] = [
    { label: 'About', section: 'about' },
    { label: "Who It's For", section: 'who-its-for' },
    { label: 'What We Do', section: 'what-we-do' },
    { label: 'Founder', section: 'founder' },
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollHandler = () => this.onScroll();
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }
  }

  ngOnDestroy(): void {
    if (this.scrollHandler && isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  onScroll(): void {
    const scrollY = window.scrollY;
    const opacity = Math.min(0.5 + scrollY / 400, 1);
    this.scrollOpacity.set(opacity);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  onNavigate(event: Event, section: string): void {
    event.preventDefault();
    this.scrollToSection(section);
  }

  onMobileNavigate(section: string): void {
    this.closeMobileMenu();
    this.scrollToSection(section);
  }

  onJoinClick(): void {
    this.joinClicked.emit();
    this.scrollToSection('join');
  }

  scrollToTop(event: Event): void {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private scrollToSection(section: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = this.document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
