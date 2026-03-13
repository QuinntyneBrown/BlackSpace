import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookieBannerComponent } from './cookie-banner.component';

describe('CookieBannerComponent', () => {
  let fixture: ComponentFixture<CookieBannerComponent>;
  let component: CookieBannerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookieBannerComponent],
    }).compileComponents();
  });

  function createComponent(overrides: { message?: string } = {}) {
    fixture = TestBed.createComponent(CookieBannerComponent);
    component = fixture.componentInstance;
    if (overrides.message !== undefined) fixture.componentRef.setInput('message', overrides.message);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should display default message', () => {
    createComponent();
    const msg = fixture.nativeElement.querySelector('.message');
    expect(msg.textContent).toContain('We use analytics to improve your experience');
  });

  it('should display custom message', () => {
    createComponent({ message: 'Custom cookie message' });
    const msg = fixture.nativeElement.querySelector('.message');
    expect(msg.textContent).toContain('Custom cookie message');
  });

  it('should render Accept button', () => {
    createComponent();
    const buttons = fixture.nativeElement.querySelectorAll('lib-button-primary');
    expect(buttons.length).toBe(1);
  });

  it('should render Learn More button', () => {
    createComponent();
    const buttons = fixture.nativeElement.querySelectorAll('lib-button-secondary');
    expect(buttons.length).toBe(1);
  });

  it('should emit accepted when Accept is clicked', () => {
    createComponent();
    const spy = vi.fn();
    component.accepted.subscribe(spy);
    const acceptBtn = fixture.nativeElement.querySelector('lib-button-primary button');
    acceptBtn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit learnMore when Learn More is clicked', () => {
    createComponent();
    const spy = vi.fn();
    component.learnMore.subscribe(spy);
    const learnMoreBtn = fixture.nativeElement.querySelector('lib-button-secondary button');
    learnMoreBtn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should have cookie-banner container', () => {
    createComponent();
    const banner = fixture.nativeElement.querySelector('.cookie-banner');
    expect(banner).toBeTruthy();
  });
});
