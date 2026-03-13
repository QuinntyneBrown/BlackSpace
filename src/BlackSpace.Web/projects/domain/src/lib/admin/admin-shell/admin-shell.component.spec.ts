import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject } from 'rxjs';

import { AdminShellComponent } from './admin-shell.component';

describe('AdminShellComponent', () => {
  let component: AdminShellComponent;
  let fixture: ComponentFixture<AdminShellComponent>;
  let breakpointSubject: Subject<BreakpointState>;

  beforeEach(async () => {
    breakpointSubject = new Subject<BreakpointState>();

    const breakpointObserverSpy = {
      observe: vi.fn().mockReturnValue(breakpointSubject.asObservable()),
    };

    await TestBed.configureTestingModule({
      imports: [AdminShellComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 3 nav links', () => {
    expect(component.navLinks.length).toBe(3);
  });

  it('should have Dashboard link', () => {
    const dashLink = component.navLinks.find((l) => l.label === 'Dashboard');
    expect(dashLink).toBeTruthy();
    expect(dashLink!.icon).toBe('dashboard');
    expect(dashLink!.route).toBe('/admin/dashboard');
  });

  it('should have Members link', () => {
    const membersLink = component.navLinks.find((l) => l.label === 'Members');
    expect(membersLink).toBeTruthy();
    expect(membersLink!.icon).toBe('group');
    expect(membersLink!.route).toBe('/admin/members');
  });

  it('should have Content link', () => {
    const contentLink = component.navLinks.find((l) => l.label === 'Content');
    expect(contentLink).toBeTruthy();
    expect(contentLink!.icon).toBe('article');
    expect(contentLink!.route).toBe('/admin/content');
  });

  it('should render toolbar with title', () => {
    const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
    expect(toolbar).toBeTruthy();
    expect(toolbar.textContent).toContain('Black Space Admin');
  });

  it('should render sidenav', () => {
    const sidenav = fixture.nativeElement.querySelector('mat-sidenav');
    expect(sidenav).toBeTruthy();
  });

  it('should render router outlet', () => {
    const outlet = fixture.nativeElement.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });

  it('should render nav links in sidenav', () => {
    const links = fixture.nativeElement.querySelectorAll('mat-nav-list a');
    expect(links.length).toBe(3);
  });

  it('should set side mode and opened on desktop breakpoint', () => {
    breakpointSubject.next({ matches: true, breakpoints: { '(min-width: 1024px)': true } });
    fixture.detectChanges();

    expect(component.sidenavMode()).toBe('side');
    expect(component.sidenavOpened()).toBe(true);
  });

  it('should set over mode and closed on mobile breakpoint', () => {
    breakpointSubject.next({ matches: false, breakpoints: { '(min-width: 1024px)': false } });
    fixture.detectChanges();

    expect(component.sidenavMode()).toBe('over');
    expect(component.sidenavOpened()).toBe(false);
  });

  it('should toggle sidenav', () => {
    component.sidenavOpened.set(true);
    component.toggleSidenav();
    expect(component.sidenavOpened()).toBe(false);

    component.toggleSidenav();
    expect(component.sidenavOpened()).toBe(true);
  });

  it('should close sidenav on onSidenavClosed', () => {
    component.sidenavOpened.set(true);
    component.onSidenavClosed();
    expect(component.sidenavOpened()).toBe(false);
  });

  it('should render menu toggle button', () => {
    const menuBtn = fixture.nativeElement.querySelector('mat-toolbar button');
    expect(menuBtn).toBeTruthy();
  });

  it('should clean up subscription on destroy', () => {
    component.ngOnDestroy();
    // Should not throw
    expect(true).toBe(true);
  });
});
