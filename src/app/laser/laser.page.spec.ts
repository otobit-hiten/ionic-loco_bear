import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LaserPage } from './laser.page';

describe('LaserPage', () => {
  let component: LaserPage;
  let fixture: ComponentFixture<LaserPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LaserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
