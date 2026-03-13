import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let httpTesting: HttpTestingController;

  const baseUrl = 'http://localhost:5000';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Flush ContentService.getStats() from ngOnInit
    const statsReq = httpTesting.expectOne(`${baseUrl}/api/content/stats`);
    statsReq.flush({ memberCount: 42, nextMeetupDate: '2026-04-01' });

    // Flush ContentService.getReferralSources() from SignupFormContainer's ngOnInit
    const refReq = httpTesting.expectOne(`${baseUrl}/api/content/referral-sources`);
    refReq.flush(['LinkedIn', 'Twitter']);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ContentService.getStats() on init', () => {
    expect(component.stats()).toEqual({ memberCount: 42, nextMeetupDate: '2026-04-01' });
  });

  it('should render the hero section', () => {
    const hero = fixture.nativeElement.querySelector('#hero, .hero');
    expect(hero).toBeTruthy();
  });

  it('should render the hero headline', () => {
    const headline = fixture.nativeElement.querySelector('.hero-headline');
    expect(headline).toBeTruthy();
    expect(headline.textContent).toContain('Black Canadians in');
    expect(headline.textContent).toContain('Space & Defence');
  });

  it('should render the hero tag', () => {
    const tag = fixture.nativeElement.querySelector('.hero-tag');
    expect(tag).toBeTruthy();
    expect(tag.textContent).toContain("Building Canada's Space Future");
  });

  it('should render the hero subheadline', () => {
    const subheadline = fixture.nativeElement.querySelector('.hero-subheadline');
    expect(subheadline).toBeTruthy();
    expect(subheadline.textContent).toContain('Connecting, elevating, and growing');
  });

  it('should render hero CTA buttons', () => {
    const hero = fixture.nativeElement.querySelector('.hero-actions');
    expect(hero).toBeTruthy();
    const buttons = hero.querySelectorAll('lib-button-primary, lib-button-secondary');
    expect(buttons.length).toBe(2);
  });

  it('should render the about section with id', () => {
    const about = fixture.nativeElement.querySelector('#about');
    expect(about).toBeTruthy();
  });

  it('should render the problem section content', () => {
    const stat = fixture.nativeElement.querySelector('.stat-callout');
    expect(stat).toBeTruthy();
    const statNumber = fixture.nativeElement.querySelector('.stat-number');
    expect(statNumber.textContent).toContain('0');
  });

  it('should render who-its-for section with id', () => {
    const section = fixture.nativeElement.querySelector('#who-its-for');
    expect(section).toBeTruthy();
  });

  it('should render 5 audience cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('lib-audience-card');
    expect(cards.length).toBe(5);
  });

  it('should render what-we-do section with id', () => {
    const section = fixture.nativeElement.querySelector('#what-we-do');
    expect(section).toBeTruthy();
  });

  it('should render 3 pillar cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('lib-pillar-card');
    expect(cards.length).toBe(3);
  });

  it('should render join section with id', () => {
    const section = fixture.nativeElement.querySelector('#join');
    expect(section).toBeTruthy();
  });

  it('should render signup form container', () => {
    const form = fixture.nativeElement.querySelector('lib-signup-form-container');
    expect(form).toBeTruthy();
  });

  it('should render founder section with id', () => {
    const section = fixture.nativeElement.querySelector('#founder');
    expect(section).toBeTruthy();
  });

  it('should render founder name', () => {
    const name = fixture.nativeElement.querySelector('.founder-name');
    expect(name).toBeTruthy();
    expect(name.textContent).toContain('Quinn Brown');
  });

  it('should render founder title', () => {
    const title = fixture.nativeElement.querySelector('.founder-title');
    expect(title).toBeTruthy();
    expect(title.textContent).toContain('MDA Space');
  });

  it('should render founder bio', () => {
    const bio = fixture.nativeElement.querySelector('.founder-bio');
    expect(bio).toBeTruthy();
    expect(bio.textContent).toContain('Canadarm3');
  });

  it('should render footer', () => {
    const footer = fixture.nativeElement.querySelector('footer');
    expect(footer).toBeTruthy();
  });

  it('should render footer logo', () => {
    const logo = fixture.nativeElement.querySelector('.footer-logo');
    expect(logo).toBeTruthy();
    expect(logo.textContent).toContain('BLACK SPACE CANADA');
  });

  it('should render footer links', () => {
    const links = fixture.nativeElement.querySelectorAll('.footer-links a');
    expect(links.length).toBe(4);
  });

  it('should render disclaimer', () => {
    const disclaimer = fixture.nativeElement.querySelector('.disclaimer');
    expect(disclaimer).toBeTruthy();
    expect(disclaimer.textContent).toContain('independent community initiative');
  });

  it('should render copyright', () => {
    const copyright = fixture.nativeElement.querySelector('.copyright');
    expect(copyright).toBeTruthy();
    expect(copyright.textContent).toContain('2026 Black Space Canada');
  });

  it('should render navigation container', () => {
    const nav = fixture.nativeElement.querySelector('lib-navigation-container');
    expect(nav).toBeTruthy();
  });

  it('should render cookie consent manager', () => {
    const cookie = fixture.nativeElement.querySelector('lib-cookie-consent-manager');
    expect(cookie).toBeTruthy();
  });

  it('should render section headers', () => {
    const headers = fixture.nativeElement.querySelectorAll('lib-section-header');
    expect(headers.length).toBeGreaterThanOrEqual(4);
  });

  it('should have all section IDs for anchor navigation', () => {
    expect(fixture.nativeElement.querySelector('#about')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#who-its-for')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#what-we-do')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#join')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#founder')).toBeTruthy();
  });
});
