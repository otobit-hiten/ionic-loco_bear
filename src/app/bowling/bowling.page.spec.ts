import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BowlingPage } from './bowling.page';

describe('BowlingPage', () => {
  let component: BowlingPage;
  let fixture: ComponentFixture<BowlingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BowlingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
