import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileMenuOverlayComponent, MenuLink } from './mobile-menu-overlay.component';

describe('MobileMenuOverlayComponent', () => {
  let fixture: ComponentFixture<MobileMenuOverlayComponent>;
  let component: MobileMenuOverlayComponent;

  const testLinks: MenuLink[] = [
    { label: 'About', section: 'about' },
    { label: 'Features', section: 'features' },
    { label: 'Contact', section: 'contact' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileMenuOverlayComponent],
    }).compileComponents();
  });

  function createComponent(overrides: { isOpen?: boolean; links?: MenuLink[] } = {}) {
    fixture = TestBed.createComponent(MobileMenuOverlayComponent);
    component = fixture.componentInstance;
    if (overrides.isOpen !== undefined) fixture.componentRef.setInput('isOpen', overrides.isOpen);
    if (overrides.links !== undefined) fixture.componentRef.setInput('links', overrides.links);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should not render when isOpen is false', () => {
    createComponent({ isOpen: false });
    const overlay = fixture.nativeElement.querySelector('.overlay');
    expect(overlay).toBeFalsy();
  });

  it('should render when isOpen is true', () => {
    createComponent({ isOpen: true, links: testLinks });
    const overlay = fixture.nativeElement.querySelector('.overlay');
    expect(overlay).toBeTruthy();
  });

  it('should display logo text', () => {
    createComponent({ isOpen: true });
    const logo = fixture.nativeElement.querySelector('.logo');
    expect(logo.textContent).toContain('BLACK SPACE');
  });

  it('should render close button', () => {
    createComponent({ isOpen: true });
    const closeBtn = fixture.nativeElement.querySelector('.close-btn');
    expect(closeBtn).toBeTruthy();
  });

  it('should emit closed when close button clicked', () => {
    createComponent({ isOpen: true });
    const spy = vi.fn();
    component.closed.subscribe(spy);
    const closeBtn = fixture.nativeElement.querySelector('.close-btn');
    closeBtn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should render navigation links', () => {
    createComponent({ isOpen: true, links: testLinks });
    const links = fixture.nativeElement.querySelectorAll('.nav-link');
    expect(links.length).toBe(3);
    expect(links[0].textContent).toContain('About');
    expect(links[1].textContent).toContain('Features');
    expect(links[2].textContent).toContain('Contact');
  });

  it('should emit navigate when a link is clicked', () => {
    createComponent({ isOpen: true, links: testLinks });
    const spy = vi.fn();
    component.navigate.subscribe(spy);
    const links = fixture.nativeElement.querySelectorAll('.nav-link');
    links[1].click();
    expect(spy).toHaveBeenCalledWith('features');
  });

  it('should render bottom CTA button', () => {
    createComponent({ isOpen: true });
    const cta = fixture.nativeElement.querySelector('.bottom-cta');
    expect(cta).toBeTruthy();
    const btn = cta.querySelector('lib-button-primary');
    expect(btn).toBeTruthy();
  });

  it('should emit navigate with join when CTA button clicked', () => {
    createComponent({ isOpen: true });
    const spy = vi.fn();
    component.navigate.subscribe(spy);
    const ctaBtn = fixture.nativeElement.querySelector('.bottom-cta lib-button-primary button');
    ctaBtn.click();
    expect(spy).toHaveBeenCalledWith('join');
  });

  it('should render no links when empty array provided', () => {
    createComponent({ isOpen: true, links: [] });
    const links = fixture.nativeElement.querySelectorAll('.nav-link');
    expect(links.length).toBe(0);
  });
});
