import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationContainerComponent } from './navigation-container.component';

describe('NavigationContainerComponent', () => {
  let component: NavigationContainerComponent;
  let fixture: ComponentFixture<NavigationContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo full text', () => {
    const logoFull = fixture.nativeElement.querySelector('.logo-full');
    expect(logoFull).toBeTruthy();
    expect(logoFull.textContent).toContain('BLACK SPACE CANADA');
  });

  it('should render the logo short text', () => {
    const logoShort = fixture.nativeElement.querySelector('.logo-short');
    expect(logoShort).toBeTruthy();
    expect(logoShort.textContent).toContain('BLACK SPACE');
  });

  it('should render desktop nav links', () => {
    const navLinks = fixture.nativeElement.querySelectorAll('.nav-link');
    expect(navLinks.length).toBe(4);
    expect(navLinks[0].textContent).toContain('About');
    expect(navLinks[1].textContent).toContain("Who It's For");
    expect(navLinks[2].textContent).toContain('What We Do');
    expect(navLinks[3].textContent).toContain('Founder');
  });

  it('should render the Join CTA button', () => {
    const button = fixture.nativeElement.querySelector('lib-button-primary');
    expect(button).toBeTruthy();
  });

  it('should render the hamburger button', () => {
    const hamburger = fixture.nativeElement.querySelector('.hamburger');
    expect(hamburger).toBeTruthy();
  });

  it('should have mobile menu closed by default', () => {
    expect(component.mobileMenuOpen()).toBe(false);
  });

  it('should toggle mobile menu when hamburger is clicked', () => {
    expect(component.mobileMenuOpen()).toBe(false);
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBe(true);
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBe(false);
  });

  it('should close mobile menu', () => {
    component.mobileMenuOpen.set(true);
    component.closeMobileMenu();
    expect(component.mobileMenuOpen()).toBe(false);
  });

  it('should close mobile menu on mobile navigate', () => {
    component.mobileMenuOpen.set(true);
    component.onMobileNavigate('about');
    expect(component.mobileMenuOpen()).toBe(false);
  });

  it('should render mobile menu overlay', () => {
    const overlay = fixture.nativeElement.querySelector('lib-mobile-menu-overlay');
    expect(overlay).toBeTruthy();
  });

  it('should have correct menu links', () => {
    expect(component.menuLinks).toEqual([
      { label: 'About', section: 'about' },
      { label: "Who It's For", section: 'who-its-for' },
      { label: 'What We Do', section: 'what-we-do' },
      { label: 'Founder', section: 'founder' },
    ]);
  });

  it('should have initial scroll opacity of 0.5', () => {
    expect(component.scrollOpacity()).toBe(0.5);
  });

  it('should update scroll opacity on scroll', () => {
    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 200, configurable: true });
    component.onScroll();
    expect(component.scrollOpacity()).toBe(0.5 + 200 / 400);

    Object.defineProperty(window, 'scrollY', { value: 800, configurable: true });
    component.onScroll();
    expect(component.scrollOpacity()).toBe(1); // capped at 1

    // Reset
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('should cap scroll opacity at 1', () => {
    Object.defineProperty(window, 'scrollY', { value: 2000, configurable: true });
    component.onScroll();
    expect(component.scrollOpacity()).toBe(1);
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('should emit joinClicked and navigate to join section', () => {
    const spy = vi.fn();
    component.joinClicked.subscribe(spy);
    component.onJoinClick();
    expect(spy).toHaveBeenCalled();
  });

  it('should navigate on link click', () => {
    const event = new Event('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    component.onNavigate(event, 'about');
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should scroll to top on logo click', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const event = new Event('click');
    vi.spyOn(event, 'preventDefault');
    component.scrollToTop(event);
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    scrollToSpy.mockRestore();
  });

  it('should apply background color based on scroll opacity', () => {
    const navbar = fixture.nativeElement.querySelector('.navbar');
    expect(navbar).toBeTruthy();
    expect(navbar.style.backgroundColor).toContain('rgba');
  });
});
