import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  SectionHeaderComponent,
  AudienceCardComponent,
  PillarCardComponent,
  ButtonPrimaryComponent,
  ButtonSecondaryComponent,
  LucideIconComponent,
} from 'components';
import { ContentService, ContentStats } from 'api';

import { SignupFormContainerComponent } from '../signup-form-container/signup-form-container.component';
import { NavigationContainerComponent } from '../navigation-container/navigation-container.component';
import { CookieConsentManagerComponent } from '../cookie-consent-manager/cookie-consent-manager.component';

@Component({
  selector: 'lib-landing-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SectionHeaderComponent,
    AudienceCardComponent,
    PillarCardComponent,
    ButtonPrimaryComponent,
    ButtonSecondaryComponent,
    LucideIconComponent,
    SignupFormContainerComponent,
    NavigationContainerComponent,
    CookieConsentManagerComponent,
  ],
  template: `
    <lib-navigation-container (joinClicked)="scrollToJoin()" />

    <!-- Hero Section -->
    <section class="hero" id="hero">
      <div class="hero-content">
        <div class="hero-tag">
          <span class="blue-dot"></span>
          Building Canada's Space Future
        </div>
        <h1 class="hero-headline">Black Canadians in<br/>Space &amp; Defence</h1>
        <p class="hero-subheadline">
          Connecting, elevating, and growing the community of Black Canadian engineers,
          scientists, and technologists in space and defence.
        </p>
        <div class="hero-actions">
          <lib-button-primary label="Join the Community" (clicked)="scrollToJoin()" />
          <lib-button-secondary label="Learn More" (clicked)="scrollToAbout()" />
        </div>
      </div>
    </section>

    <!-- Problem Section -->
    <section class="problem" id="about">
      <div class="section-container">
        <lib-section-header
          label="WHY THIS EXISTS"
          headline="The talent is here.\nThe network wasn't."
        />
        <div class="problem-content">
          <p>
            Canada's space sector is growing fast — from satellite communications to lunar exploration
            to continental defence. But Black Canadians remain significantly underrepresented in
            these industries.
          </p>
          <p>
            Not because of a lack of talent. Because of a lack of networks, visibility, and
            structured pathways into the sector.
          </p>
          <div class="stat-callout">
            <span class="stat-number">{{ statNumber() }}</span>
            <span class="stat-description">
              The number of dedicated professional networks for Black Canadians
              in the space and defence sector.
            </span>
          </div>
          <p>
            We're building the network that connects Black Canadian professionals in space and
            defence — creating visibility for the talent that's already here and building the
            pipeline for those who are next.
          </p>
        </div>
      </div>
    </section>

    <!-- Who It's For Section -->
    <section class="who-its-for" id="who-its-for">
      <div class="section-container">
        <lib-section-header
          label="WHO IT'S FOR"
          headline="Is this community for you?"
        />
        <div class="audience-grid">
          <lib-audience-card
            iconName="code"
            title="Software Engineers"
            description="Writing flight software, ground systems, C2 platforms, simulations"
          />
          <lib-audience-card
            iconName="cpu"
            title="Hardware Engineers"
            description="Designing circuits, testing components, building the physical tech that goes to space"
          />
          <lib-audience-card
            iconName="graduation-cap"
            title="Students & New Grads"
            description="Studying STEM and looking for mentors, internships, and a path into the sector"
          />
          <lib-audience-card
            iconName="rocket"
            title="Entrepreneurs"
            description="Building startups and ventures in space tech, defence tech, or dual-use industries"
          />
          <lib-audience-card
            iconName="flask-conical"
            title="Scientists & Researchers"
            description="Conducting research in astrophysics, remote sensing, materials science, propulsion"
          />
        </div>
      </div>
    </section>

    <!-- What We Do Section -->
    <section class="what-we-do" id="what-we-do">
      <div class="section-container">
        <lib-section-header
          label="WHAT WE DO"
          headline="What we actually do."
        />
        <div class="pillar-grid">
          <lib-pillar-card
            iconName="network"
            title="Networking"
            description="We build professional networks that connect Black Canadian engineers, scientists, and technologists across the space and defence sector."
          />
          <lib-pillar-card
            iconName="eye"
            title="Visibility"
            description="We spotlight the work Black Canadians are already doing in space and defence — through stories, events, and public advocacy."
          />
          <lib-pillar-card
            iconName="git-branch"
            title="Pipeline"
            description="We create pathways for the next generation to enter and thrive in the space and defence sector — mentorship, internships, and career support."
          />
        </div>
      </div>
    </section>

    <!-- Signup Section -->
    <section class="signup" id="join">
      <div class="section-container">
        <lib-section-header
          label="JOIN US"
          headline="Join Black Space Canada"
        />
        <div class="signup-form-wrapper">
          <lib-signup-form-container />
        </div>
      </div>
    </section>

    <!-- Founder Section -->
    <section class="founder" id="founder">
      <div class="section-container">
        <div class="founder-card">
          <img
            class="founder-photo"
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"
            alt="Quinn Brown"
          />
          <div class="founder-info">
            <h3 class="founder-name">Quinn Brown</h3>
            <p class="founder-title">Senior .NET Consultant &amp; Software Quality Lead, MDA Space</p>
            <p class="founder-bio">
              Currently building software for Canadarm3 on NASA's Lunar Gateway program.
              Started Black Space Canada because this community should have existed years ago.
            </p>
            <a
              class="founder-linkedin"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <lib-lucide-icon name="linkedin" [size]="20" color="#4F9CF7" />
              <span>Connect on LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="section-container">
        <div class="footer-top">
          <span class="footer-logo">BLACK SPACE CANADA</span>
          <div class="footer-links">
            <a href="#about" (click)="onFooterNav($event, 'about')">About</a>
            <a href="#who-its-for" (click)="onFooterNav($event, 'who-its-for')">Who It's For</a>
            <a href="#what-we-do" (click)="onFooterNav($event, 'what-we-do')">What We Do</a>
            <a href="mailto:hello@blackspace.ca">Contact</a>
          </div>
          <a
            class="footer-social"
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <lib-lucide-icon name="linkedin" [size]="20" color="#FFFFFF" />
          </a>
        </div>
        <div class="footer-bottom">
          <p class="disclaimer">
            Black Space Canada is an independent community initiative.
            Not affiliated with any employer or government agency.
          </p>
          <p class="copyright">&copy; 2026 Black Space Canada. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <lib-cookie-consent-manager />
  `,
  styles: `
    :host {
      display: block;
      color: #FFFFFF;
      font-family: 'Inter', sans-serif;
    }

    .section-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Hero */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: radial-gradient(ellipse at center, #0D1B3E 0%, #07080F 70%);
      padding: 6rem 1.5rem 4rem;
    }
    .hero-content {
      max-width: 800px;
    }
    .hero-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #4F9CF710;
      border: 1px solid #4F9CF730;
      border-radius: 9999px;
      padding: 0.375rem 1rem;
      font-size: 0.875rem;
      color: #4F9CF7;
      margin-bottom: 1.5rem;
    }
    .blue-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4F9CF7;
    }
    .hero-headline {
      font-family: 'Sora', sans-serif;
      font-size: 64px;
      font-weight: 700;
      line-height: 1.1;
      margin: 0 0 1.5rem;
    }
    .hero-subheadline {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin: 0 0 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Problem */
    .problem {
      padding: 6rem 0;
      background: #07080F;
    }
    .problem-content {
      max-width: 720px;
      margin: 2rem auto 0;
    }
    .problem-content p {
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.8;
      margin: 0 0 1.5rem;
    }
    .stat-callout {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2.5rem;
      margin: 2rem 0;
      background: rgba(79, 156, 247, 0.05);
      border: 1px solid rgba(79, 156, 247, 0.1);
      border-radius: 1rem;
    }
    .stat-number {
      font-family: 'Sora', sans-serif;
      font-size: 4rem;
      font-weight: 700;
      color: #4F9CF7;
    }
    .stat-description {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.6);
      max-width: 500px;
      margin-top: 0.5rem;
    }

    /* Who It's For */
    .who-its-for {
      padding: 6rem 0;
      background: #0A0D14;
    }
    .audience-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-top: 3rem;
    }

    /* What We Do */
    .what-we-do {
      padding: 6rem 0;
      background: #07080F;
    }
    .pillar-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-top: 3rem;
    }

    /* Signup */
    .signup {
      padding: 6rem 0;
      background: #0A0D14;
    }
    .signup-form-wrapper {
      max-width: 560px;
      margin: 2rem auto 0;
    }

    /* Founder */
    .founder {
      padding: 6rem 0;
      background: #07080F;
    }
    .founder-card {
      display: flex;
      gap: 2.5rem;
      align-items: center;
      max-width: 720px;
      margin: 0 auto;
    }
    .founder-photo {
      width: 200px;
      height: 200px;
      border-radius: 1rem;
      object-fit: cover;
      flex-shrink: 0;
    }
    .founder-name {
      font-family: 'Sora', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.25rem;
    }
    .founder-title {
      font-size: 0.875rem;
      color: #4F9CF7;
      margin: 0 0 1rem;
    }
    .founder-bio {
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin: 0 0 1rem;
    }
    .founder-linkedin {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #4F9CF7;
      text-decoration: none;
      font-size: 0.875rem;
    }
    .founder-linkedin:hover {
      text-decoration: underline;
    }

    /* Footer */
    .footer {
      padding: 3rem 0 2rem;
      background: #050608;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .footer-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1.5rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .footer-logo {
      font-weight: 700;
      font-size: 0.875rem;
      letter-spacing: 0.15em;
    }
    .footer-links {
      display: flex;
      gap: 2rem;
    }
    .footer-links a {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      font-size: 0.875rem;
    }
    .footer-links a:hover {
      color: #FFFFFF;
    }
    .footer-social {
      display: flex;
      align-items: center;
    }
    .footer-bottom {
      padding-top: 2rem;
      text-align: center;
    }
    .disclaimer {
      font-size: 0.8125rem;
      color: rgba(255, 255, 255, 0.4);
      margin: 0 0 0.5rem;
    }
    .copyright {
      font-size: 0.8125rem;
      color: rgba(255, 255, 255, 0.4);
      margin: 0;
    }

    @media (max-width: 1024px) {
      .hero-headline {
        font-size: 44px;
      }
    }

    @media (max-width: 768px) {
      .hero-headline {
        font-size: 32px;
      }
      .audience-grid {
        grid-template-columns: 1fr;
      }
      .pillar-grid {
        grid-template-columns: 1fr;
      }
      .founder-card {
        flex-direction: column;
        text-align: center;
      }
      .founder-linkedin {
        justify-content: center;
      }
    }
  `,
})
export class LandingPageComponent implements OnInit {
  private readonly contentService = inject(ContentService);

  readonly stats = signal<ContentStats | null>(null);

  ngOnInit(): void {
    this.contentService.getStats().subscribe({
      next: (data) => this.stats.set(data),
    });
  }

  statNumber(): string {
    return '0';
  }

  scrollToJoin(): void {
    document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToAbout(): void {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }

  onFooterNav(event: Event, section: string): void {
    event.preventDefault();
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
}
