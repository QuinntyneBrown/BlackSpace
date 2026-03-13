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
  templateUrl: './navigation-container.component.html',
  styleUrl: './navigation-container.component.scss',
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
