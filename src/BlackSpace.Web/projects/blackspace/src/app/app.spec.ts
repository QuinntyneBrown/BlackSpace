import { TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have a router-outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});

describe('App Routes', () => {
  it('should have a default route', () => {
    expect(routes.length).toBeGreaterThan(0);
    expect(routes[0].path).toBe('');
  });

  it('should lazy-load the LandingPageComponent', async () => {
    const route = routes[0];
    expect(route.loadComponent).toBeDefined();

    const component = await route.loadComponent!() as any;
    expect(component).toBeDefined();
    expect(typeof component).toBe('function');
  });
});
