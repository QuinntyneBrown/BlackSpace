import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { routes } from './app.routes';

describe('Admin App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have a router-outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});

describe('Admin Routes', () => {
  it('should have admin as the main route', () => {
    const adminRoute = routes.find((r) => r.path === 'admin');
    expect(adminRoute).toBeDefined();
    expect(adminRoute!.children).toBeDefined();
    expect(adminRoute!.children!.length).toBe(4);
  });

  it('should have a default redirect to admin', () => {
    const defaultRoute = routes.find((r) => r.path === '');
    expect(defaultRoute).toBeDefined();
    expect(defaultRoute!.redirectTo).toBe('admin');
  });

  it('should have dashboard route', () => {
    const adminRoute = routes.find((r) => r.path === 'admin');
    const dashboardRoute = adminRoute!.children!.find((r) => r.path === 'dashboard');
    expect(dashboardRoute).toBeDefined();
    expect(dashboardRoute!.loadComponent).toBeDefined();
  });

  it('should have members route', () => {
    const adminRoute = routes.find((r) => r.path === 'admin');
    const membersRoute = adminRoute!.children!.find((r) => r.path === 'members');
    expect(membersRoute).toBeDefined();
    expect(membersRoute!.loadComponent).toBeDefined();
  });

  it('should have content route', () => {
    const adminRoute = routes.find((r) => r.path === 'admin');
    const contentRoute = adminRoute!.children!.find((r) => r.path === 'content');
    expect(contentRoute).toBeDefined();
    expect(contentRoute!.loadComponent).toBeDefined();
  });

  it('should have a default child redirect to dashboard', () => {
    const adminRoute = routes.find((r) => r.path === 'admin');
    const defaultChild = adminRoute!.children!.find((r) => r.path === '');
    expect(defaultChild).toBeDefined();
    expect(defaultChild!.redirectTo).toBe('dashboard');
  });

  it('should lazy-load AdminShellComponent', async () => {
    const adminRoute = routes.find((r) => r.path === 'admin');
    const component = await adminRoute!.loadComponent!() as any;
    expect(component).toBeDefined();
  });

  it('should lazy-load AdminDashboardPageComponent', async () => {
    const adminRoute = routes.find((r) => r.path === 'admin');
    const dashboardRoute = adminRoute!.children!.find((r) => r.path === 'dashboard');
    const component = await dashboardRoute!.loadComponent!() as any;
    expect(component).toBeDefined();
  });

  it('should lazy-load MemberListPageComponent', async () => {
    const adminRoute = routes.find((r) => r.path === 'admin');
    const membersRoute = adminRoute!.children!.find((r) => r.path === 'members');
    const component = await membersRoute!.loadComponent!() as any;
    expect(component).toBeDefined();
  });

  it('should lazy-load ContentManagementPageComponent', async () => {
    const adminRoute = routes.find((r) => r.path === 'admin');
    const contentRoute = adminRoute!.children!.find((r) => r.path === 'content');
    const component = await contentRoute!.loadComponent!() as any;
    expect(component).toBeDefined();
  });
});
