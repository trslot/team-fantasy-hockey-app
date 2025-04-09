import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FantasyTeamsComponent } from './fantasy-teams.component';

describe('FantasyTeamsComponent', () => {
  let component: FantasyTeamsComponent;
  let fixture: ComponentFixture<FantasyTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FantasyTeamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FantasyTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
