import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AdminSearchBarComponent } from './admin-search-bar.component';

describe('AdminSearchBarComponent', () => {
  let fixture: ComponentFixture<AdminSearchBarComponent>;
  let component: AdminSearchBarComponent;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [AdminSearchBarComponent, NoopAnimationsModule],
    }).compileComponents();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function createComponent(overrides: { placeholder?: string } = {}) {
    fixture = TestBed.createComponent(AdminSearchBarComponent);
    component = fixture.componentInstance;
    if (overrides.placeholder !== undefined)
      fixture.componentRef.setInput('placeholder', overrides.placeholder);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should render input element', () => {
    createComponent();
    const input = fixture.nativeElement.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('should use default placeholder', () => {
    createComponent();
    expect(component.placeholder()).toBe('Search...');
  });

  it('should use custom placeholder', () => {
    createComponent({ placeholder: 'Find users...' });
    expect(component.placeholder()).toBe('Find users...');
  });

  it('should render search icon', () => {
    createComponent();
    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent).toContain('search');
  });

  it('should debounce search input', () => {
    createComponent();
    const spy = vi.fn();
    component.searchChange.subscribe(spy);

    component.onInput('hel');
    vi.advanceTimersByTime(100);
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(spy).toHaveBeenCalledWith('hel');
  });

  it('should emit latest value after debounce', () => {
    createComponent();
    const spy = vi.fn();
    component.searchChange.subscribe(spy);

    component.onInput('he');
    vi.advanceTimersByTime(100);
    component.onInput('hello');
    vi.advanceTimersByTime(300);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('hello');
  });

  it('should update searchValue on input', () => {
    createComponent();
    component.onInput('test');
    expect(component.searchValue()).toBe('test');
  });

  it('should clear search value and emit empty string on clear', () => {
    createComponent();
    const spy = vi.fn();
    component.searchChange.subscribe(spy);

    component.onInput('test');
    vi.advanceTimersByTime(300);
    spy.mockClear();

    component.onClear();
    expect(component.searchValue()).toBe('');
    vi.advanceTimersByTime(300);
    expect(spy).toHaveBeenCalledWith('');
  });

  it('should show clear button when searchValue is non-empty', () => {
    createComponent();
    component.searchValue.set('test');
    fixture.detectChanges();
    const clearBtn = fixture.nativeElement.querySelector('button[aria-label="Clear"]');
    expect(clearBtn).toBeTruthy();
  });

  it('should not show clear button when searchValue is empty', () => {
    createComponent();
    const clearBtn = fixture.nativeElement.querySelector('button[aria-label="Clear"]');
    expect(clearBtn).toBeFalsy();
  });

  it('should unsubscribe on destroy', () => {
    createComponent();
    const spy = vi.fn();
    component.searchChange.subscribe(spy);

    component.onInput('test');
    component.ngOnDestroy();
    vi.advanceTimersByTime(300);
    expect(spy).not.toHaveBeenCalled();
  });
});
