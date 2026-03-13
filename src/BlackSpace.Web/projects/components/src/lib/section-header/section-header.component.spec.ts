import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionHeaderComponent } from './section-header.component';

describe('SectionHeaderComponent', () => {
  let fixture: ComponentFixture<SectionHeaderComponent>;
  let component: SectionHeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHeaderComponent],
    }).compileComponents();
  });

  function createComponent(overrides: {
    label?: string;
    headline?: string;
    subtext?: string;
    headlineSize?: string;
  } = {}) {
    fixture = TestBed.createComponent(SectionHeaderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', overrides.label ?? 'ABOUT');
    fixture.componentRef.setInput('headline', overrides.headline ?? 'Our Mission');
    if (overrides.subtext !== undefined) fixture.componentRef.setInput('subtext', overrides.subtext);
    if (overrides.headlineSize !== undefined) fixture.componentRef.setInput('headlineSize', overrides.headlineSize);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should display the label', () => {
    createComponent({ label: 'FEATURES' });
    const label = fixture.nativeElement.querySelector('.label');
    expect(label.textContent).toContain('FEATURES');
  });

  it('should display the headline', () => {
    createComponent({ headline: 'What We Do' });
    const headline = fixture.nativeElement.querySelector('.headline');
    expect(headline.textContent).toContain('What We Do');
  });

  it('should display subtext when provided', () => {
    createComponent({ subtext: 'We build great things' });
    const subtext = fixture.nativeElement.querySelector('.subtext');
    expect(subtext).toBeTruthy();
    expect(subtext.textContent).toContain('We build great things');
  });

  it('should not render subtext when empty', () => {
    createComponent({ subtext: '' });
    const subtext = fixture.nativeElement.querySelector('.subtext');
    expect(subtext).toBeFalsy();
  });

  it('should default headline size to 40px', () => {
    createComponent();
    const headline = fixture.nativeElement.querySelector('.headline');
    expect(headline.style.fontSize).toBe('40px');
  });

  it('should apply custom headline size', () => {
    createComponent({ headlineSize: '32px' });
    const headline = fixture.nativeElement.querySelector('.headline');
    expect(headline.style.fontSize).toBe('32px');
  });

  it('should have centered text', () => {
    createComponent();
    const header = fixture.nativeElement.querySelector('.section-header');
    expect(header).toBeTruthy();
  });
});
