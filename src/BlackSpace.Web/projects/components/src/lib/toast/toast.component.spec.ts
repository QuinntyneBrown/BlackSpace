import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let fixture: ComponentFixture<ToastComponent>;
  let component: ToastComponent;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
    }).compileComponents();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function createComponent(overrides: {
    title?: string;
    description?: string;
    type?: 'success' | 'warning' | 'error';
    visible?: boolean;
    duration?: number;
  } = {}) {
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', overrides.title ?? 'Test');
    fixture.componentRef.setInput('description', overrides.description ?? 'Test description');
    fixture.componentRef.setInput('type', overrides.type ?? 'success');
    if (overrides.visible !== undefined) fixture.componentRef.setInput('visible', overrides.visible);
    if (overrides.duration !== undefined) fixture.componentRef.setInput('duration', overrides.duration);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should render toast when visible', () => {
    createComponent({ visible: true });
    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast).toBeTruthy();
  });

  it('should not render toast when not visible', () => {
    createComponent({ visible: false });
    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast).toBeFalsy();
  });

  it('should display title and description', () => {
    createComponent({ title: 'Success!', description: 'Item saved' });
    const title = fixture.nativeElement.querySelector('.title');
    const desc = fixture.nativeElement.querySelector('.description');
    expect(title.textContent).toContain('Success!');
    expect(desc.textContent).toContain('Item saved');
  });

  it('should apply success type class', () => {
    createComponent({ type: 'success' });
    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast.classList.contains('toast-success')).toBe(true);
  });

  it('should apply warning type class', () => {
    createComponent({ type: 'warning' });
    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast.classList.contains('toast-warning')).toBe(true);
  });

  it('should apply error type class', () => {
    createComponent({ type: 'error' });
    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast.classList.contains('toast-error')).toBe(true);
  });

  it('should emit closed when close button clicked', () => {
    createComponent();
    const spy = vi.fn();
    component.closed.subscribe(spy);
    const closeBtn = fixture.nativeElement.querySelector('.close-btn');
    closeBtn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should auto-dismiss after duration', () => {
    createComponent({ duration: 1000 });
    const spy = vi.fn();
    component.closed.subscribe(spy);
    vi.advanceTimersByTime(1000);
    expect(spy).toHaveBeenCalled();
  });

  it('should not auto-dismiss when duration is 0', () => {
    createComponent({ duration: 0 });
    const spy = vi.fn();
    component.closed.subscribe(spy);
    vi.advanceTimersByTime(10000);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should render success icon for success type', () => {
    createComponent({ type: 'success' });
    const iconCircle = fixture.nativeElement.querySelector('.icon-circle-success');
    expect(iconCircle).toBeTruthy();
  });

  it('should render warning icon for warning type', () => {
    createComponent({ type: 'warning' });
    const iconCircle = fixture.nativeElement.querySelector('.icon-circle-warning');
    expect(iconCircle).toBeTruthy();
  });

  it('should render error icon for error type', () => {
    createComponent({ type: 'error' });
    const iconCircle = fixture.nativeElement.querySelector('.icon-circle-error');
    expect(iconCircle).toBeTruthy();
  });

  it('should return correct icon color for success', () => {
    createComponent({ type: 'success' });
    expect(component.iconColor()).toBe('#32D74B');
  });

  it('should return correct icon color for warning', () => {
    createComponent({ type: 'warning' });
    expect(component.iconColor()).toBe('#FF9900');
  });

  it('should return correct icon color for error', () => {
    createComponent({ type: 'error' });
    expect(component.iconColor()).toBe('#FF3B30');
  });

  it('should cleanup timer on destroy', () => {
    createComponent({ duration: 5000 });
    const spy = vi.fn();
    component.closed.subscribe(spy);
    component.ngOnDestroy();
    vi.advanceTimersByTime(5000);
    expect(spy).not.toHaveBeenCalled();
  });
});
