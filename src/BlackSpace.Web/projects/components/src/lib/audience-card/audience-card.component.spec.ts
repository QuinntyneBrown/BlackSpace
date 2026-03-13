import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudienceCardComponent } from './audience-card.component';

describe('AudienceCardComponent', () => {
  let fixture: ComponentFixture<AudienceCardComponent>;
  let component: AudienceCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudienceCardComponent],
    }).compileComponents();
  });

  function createComponent(overrides: { iconName?: string; title?: string; description?: string } = {}) {
    fixture = TestBed.createComponent(AudienceCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('iconName', overrides.iconName ?? 'code');
    fixture.componentRef.setInput('title', overrides.title ?? 'Developers');
    fixture.componentRef.setInput('description', overrides.description ?? 'Build amazing things');
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    createComponent({ title: 'Engineers' });
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toContain('Engineers');
  });

  it('should display the description', () => {
    createComponent({ description: 'Build cool stuff' });
    const desc = fixture.nativeElement.querySelector('.description');
    expect(desc.textContent).toContain('Build cool stuff');
  });

  it('should render the icon component', () => {
    createComponent({ iconName: 'cpu' });
    const icon = fixture.nativeElement.querySelector('lib-lucide-icon');
    expect(icon).toBeTruthy();
  });

  it('should have card structure', () => {
    createComponent();
    const card = fixture.nativeElement.querySelector('.card');
    expect(card).toBeTruthy();
  });
});
