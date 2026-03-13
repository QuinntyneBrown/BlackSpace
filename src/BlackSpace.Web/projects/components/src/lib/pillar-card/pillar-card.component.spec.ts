import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PillarCardComponent } from './pillar-card.component';

describe('PillarCardComponent', () => {
  let fixture: ComponentFixture<PillarCardComponent>;
  let component: PillarCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PillarCardComponent],
    }).compileComponents();
  });

  function createComponent(overrides: { iconName?: string; title?: string; description?: string } = {}) {
    fixture = TestBed.createComponent(PillarCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('iconName', overrides.iconName ?? 'rocket');
    fixture.componentRef.setInput('title', overrides.title ?? 'Innovation');
    fixture.componentRef.setInput('description', overrides.description ?? 'Push boundaries');
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    createComponent({ title: 'Education' });
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toContain('Education');
  });

  it('should display the description', () => {
    createComponent({ description: 'Learn new things' });
    const desc = fixture.nativeElement.querySelector('.description');
    expect(desc.textContent).toContain('Learn new things');
  });

  it('should render the icon container', () => {
    createComponent();
    const container = fixture.nativeElement.querySelector('.icon-container');
    expect(container).toBeTruthy();
  });

  it('should render the icon component', () => {
    createComponent({ iconName: 'flask-conical' });
    const icon = fixture.nativeElement.querySelector('lib-lucide-icon');
    expect(icon).toBeTruthy();
  });

  it('should have card structure', () => {
    createComponent();
    const card = fixture.nativeElement.querySelector('.card');
    expect(card).toBeTruthy();
  });
});
