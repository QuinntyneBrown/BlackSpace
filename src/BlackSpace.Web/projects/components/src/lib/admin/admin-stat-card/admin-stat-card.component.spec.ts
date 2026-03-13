import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminStatCardComponent } from './admin-stat-card.component';

describe('AdminStatCardComponent', () => {
  let fixture: ComponentFixture<AdminStatCardComponent>;
  let component: AdminStatCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStatCardComponent],
    }).compileComponents();
  });

  function createComponent(
    overrides: {
      icon?: string;
      label?: string;
      value?: string;
      color?: 'primary' | 'accent' | 'warn';
    } = {},
  ) {
    fixture = TestBed.createComponent(AdminStatCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('icon', overrides.icon ?? 'people');
    fixture.componentRef.setInput('label', overrides.label ?? 'Total Users');
    fixture.componentRef.setInput('value', overrides.value ?? '1,234');
    if (overrides.color !== undefined) fixture.componentRef.setInput('color', overrides.color);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should render the icon', () => {
    createComponent({ icon: 'people' });
    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent).toContain('people');
  });

  it('should render the label', () => {
    createComponent({ label: 'Total Users' });
    const label = fixture.nativeElement.querySelector('.stat-label');
    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Total Users');
  });

  it('should render the value', () => {
    createComponent({ value: '1,234' });
    const value = fixture.nativeElement.querySelector('.stat-value');
    expect(value).toBeTruthy();
    expect(value.textContent).toContain('1,234');
  });

  it('should use default color of primary', () => {
    createComponent();
    expect(component.color()).toBe('primary');
  });

  it('should apply primary color class', () => {
    createComponent({ color: 'primary' });
    const card = fixture.nativeElement.querySelector('.stat-card');
    expect(card.classList.contains('stat-card-primary')).toBe(true);
    const iconContainer = fixture.nativeElement.querySelector('.icon-container');
    expect(iconContainer.classList.contains('icon-primary')).toBe(true);
  });

  it('should apply accent color class', () => {
    createComponent({ color: 'accent' });
    const card = fixture.nativeElement.querySelector('.stat-card');
    expect(card.classList.contains('stat-card-accent')).toBe(true);
    const iconContainer = fixture.nativeElement.querySelector('.icon-container');
    expect(iconContainer.classList.contains('icon-accent')).toBe(true);
  });

  it('should apply warn color class', () => {
    createComponent({ color: 'warn' });
    const card = fixture.nativeElement.querySelector('.stat-card');
    expect(card.classList.contains('stat-card-warn')).toBe(true);
    const iconContainer = fixture.nativeElement.querySelector('.icon-container');
    expect(iconContainer.classList.contains('icon-warn')).toBe(true);
  });

  it('should render mat-card element', () => {
    createComponent();
    const card = fixture.nativeElement.querySelector('mat-card');
    expect(card).toBeTruthy();
  });

  it('should display different icon names', () => {
    createComponent({ icon: 'trending_up' });
    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon.textContent).toContain('trending_up');
  });
});
