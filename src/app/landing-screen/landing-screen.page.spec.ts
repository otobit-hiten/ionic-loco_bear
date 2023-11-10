import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingScreenPage } from './landing-screen.page';

describe('LandingScreenPage', () => {
  let component: LandingScreenPage;
  let fixture: ComponentFixture<LandingScreenPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LandingScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
