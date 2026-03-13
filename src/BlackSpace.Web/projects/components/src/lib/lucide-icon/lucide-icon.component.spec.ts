import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LucideIconComponent } from './lucide-icon.component';

describe('LucideIconComponent', () => {
  let fixture: ComponentFixture<LucideIconComponent>;
  let component: LucideIconComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LucideIconComponent],
    }).compileComponents();
  });

  function createComponent(name: string, size?: number, color?: string) {
    fixture = TestBed.createComponent(LucideIconComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', name);
    if (size !== undefined) fixture.componentRef.setInput('size', size);
    if (color !== undefined) fixture.componentRef.setInput('color', color);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent('check');
    expect(component).toBeTruthy();
  });

  it('should render an SVG element', () => {
    createComponent('check');
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should use default size of 24', () => {
    createComponent('check');
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
  });

  it('should apply custom size', () => {
    createComponent('check', 32);
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('width')).toBe('32');
    expect(svg.getAttribute('height')).toBe('32');
  });

  it('should use default color of currentColor', () => {
    createComponent('check');
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
  });

  it('should apply custom color', () => {
    createComponent('check', undefined, '#FF0000');
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('stroke')).toBe('#FF0000');
  });

  it('should render correct path data for known icons', () => {
    createComponent('check');
    const path = fixture.nativeElement.querySelector('path');
    expect(path.getAttribute('d')).toBe('M20 6L9 17l-5-5');
  });

  it('should render empty path for unknown icon', () => {
    createComponent('nonexistent');
    const path = fixture.nativeElement.querySelector('path');
    expect(path.getAttribute('d')).toBe('');
  });

  it('should render path data for x icon', () => {
    createComponent('x');
    const path = fixture.nativeElement.querySelector('path');
    expect(path.getAttribute('d')).toBe('M18 6L6 18M6 6l12 12');
  });

  it('should render path data for menu icon', () => {
    createComponent('menu');
    const path = fixture.nativeElement.querySelector('path');
    expect(path.getAttribute('d')).toBe('M4 12h16M4 6h16M4 18h16');
  });
});
