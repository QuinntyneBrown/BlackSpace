import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieConsentManagerComponent } from './cookie-consent-manager.component';

describe('CookieConsentManagerComponent', () => {
  let component: CookieConsentManagerComponent;
  let fixture: ComponentFixture<CookieConsentManagerComponent>;

  beforeEach(async () => {
    // Clear localStorage before each test
    localStorage.removeItem('cookie-consent');

    await TestBed.configureTestingModule({
      imports: [CookieConsentManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CookieConsentManagerComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.removeItem('cookie-consent');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show banner when no cookie-consent in localStorage', () => {
    fixture.detectChanges();
    expect(component.showBanner()).toBe(true);
  });

  it('should render cookie banner when showBanner is true', () => {
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector('lib-cookie-banner');
    expect(banner).toBeTruthy();
  });

  it('should not show banner when cookie-consent exists in localStorage', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    fixture.detectChanges();
    expect(component.showBanner()).toBe(false);
  });

  it('should not render cookie banner when consent is already given', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector('lib-cookie-banner');
    expect(banner).toBeFalsy();
  });

  it('should hide banner on accept', () => {
    fixture.detectChanges();
    expect(component.showBanner()).toBe(true);

    component.onAccept();
    expect(component.showBanner()).toBe(false);
  });

  it('should set localStorage on accept', () => {
    fixture.detectChanges();
    component.onAccept();
    expect(localStorage.getItem('cookie-consent')).toBe('accepted');
  });

  it('should not render banner after accept', () => {
    fixture.detectChanges();
    component.onAccept();
    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('lib-cookie-banner');
    expect(banner).toBeFalsy();
  });

  it('should open privacy page on learn more', () => {
    fixture.detectChanges();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    component.onLearnMore();
    expect(openSpy).toHaveBeenCalledWith('https://blackspace.ca/privacy', '_blank');
    openSpy.mockRestore();
  });

  it('should have fixed position wrapper', () => {
    fixture.detectChanges();
    const wrapper = fixture.nativeElement.querySelector('.cookie-consent-wrapper');
    expect(wrapper).toBeTruthy();
  });
});
