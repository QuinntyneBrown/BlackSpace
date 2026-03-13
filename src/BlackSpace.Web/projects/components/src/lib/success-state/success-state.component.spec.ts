import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuccessStateComponent } from './success-state.component';

describe('SuccessStateComponent', () => {
  let fixture: ComponentFixture<SuccessStateComponent>;
  let component: SuccessStateComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessStateComponent],
    }).compileComponents();
  });

  function createComponent(overrides: { title?: string; description?: string } = {}) {
    fixture = TestBed.createComponent(SuccessStateComponent);
    component = fixture.componentInstance;
    if (overrides.title !== undefined) fixture.componentRef.setInput('title', overrides.title);
    if (overrides.description !== undefined) fixture.componentRef.setInput('description', overrides.description);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should display default title', () => {
    createComponent();
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toContain("You're in. Welcome to the community.");
  });

  it('should display custom title', () => {
    createComponent({ title: 'Registration complete!' });
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toContain('Registration complete!');
  });

  it('should display description when provided', () => {
    createComponent({ description: 'Check your email' });
    const desc = fixture.nativeElement.querySelector('.description');
    expect(desc).toBeTruthy();
    expect(desc.textContent).toContain('Check your email');
  });

  it('should not render description when empty', () => {
    createComponent({ description: '' });
    const desc = fixture.nativeElement.querySelector('.description');
    expect(desc).toBeFalsy();
  });

  it('should render the icon circle', () => {
    createComponent();
    const iconCircle = fixture.nativeElement.querySelector('.icon-circle');
    expect(iconCircle).toBeTruthy();
  });

  it('should render the check icon', () => {
    createComponent();
    const icon = fixture.nativeElement.querySelector('lib-lucide-icon');
    expect(icon).toBeTruthy();
  });

  it('should render the accent line', () => {
    createComponent();
    const line = fixture.nativeElement.querySelector('.accent-line');
    expect(line).toBeTruthy();
  });

  it('should have success-state container', () => {
    createComponent();
    const container = fixture.nativeElement.querySelector('.success-state');
    expect(container).toBeTruthy();
  });
});
