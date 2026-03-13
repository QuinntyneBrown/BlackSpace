import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertBannerComponent } from './alert-banner.component';

describe('AlertBannerComponent', () => {
  let fixture: ComponentFixture<AlertBannerComponent>;
  let component: AlertBannerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertBannerComponent],
    }).compileComponents();
  });

  function createComponent(overrides: { message?: string; type?: 'error' | 'warning' | 'info' } = {}) {
    fixture = TestBed.createComponent(AlertBannerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('message', overrides.message ?? 'Something went wrong');
    fixture.componentRef.setInput('type', overrides.type ?? 'error');
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should display the message', () => {
    createComponent({ message: 'Invalid input' });
    const msg = fixture.nativeElement.querySelector('.message');
    expect(msg.textContent).toContain('Invalid input');
  });

  it('should apply error type class', () => {
    createComponent({ type: 'error' });
    const banner = fixture.nativeElement.querySelector('.banner');
    expect(banner.classList.contains('banner-error')).toBe(true);
  });

  it('should apply warning type class', () => {
    createComponent({ type: 'warning' });
    const banner = fixture.nativeElement.querySelector('.banner');
    expect(banner.classList.contains('banner-warning')).toBe(true);
  });

  it('should apply info type class', () => {
    createComponent({ type: 'info' });
    const banner = fixture.nativeElement.querySelector('.banner');
    expect(banner.classList.contains('banner-info')).toBe(true);
  });

  it('should render the icon', () => {
    createComponent();
    const icon = fixture.nativeElement.querySelector('lib-lucide-icon');
    expect(icon).toBeTruthy();
  });

  it('should return correct icon color for error', () => {
    createComponent({ type: 'error' });
    expect(component.iconColor()).toBe('#FF3B30');
  });

  it('should return correct icon color for warning', () => {
    createComponent({ type: 'warning' });
    expect(component.iconColor()).toBe('#FF9900');
  });

  it('should return correct icon color for info', () => {
    createComponent({ type: 'info' });
    expect(component.iconColor()).toBe('#4F9CF7');
  });
});
