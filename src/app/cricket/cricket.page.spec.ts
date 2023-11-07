import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CricketPage } from './cricket.page';

describe('CricketPage', () => {
  let component: CricketPage;
  let fixture: ComponentFixture<CricketPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CricketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
