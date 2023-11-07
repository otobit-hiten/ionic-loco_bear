import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShootingPage } from './shooting.page';

describe('ShootingPage', () => {
  let component: ShootingPage;
  let fixture: ComponentFixture<ShootingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShootingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
