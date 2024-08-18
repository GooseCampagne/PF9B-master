import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoutineModalPage } from './routine-modal.page';

describe('RoutineModalPage', () => {
  let component: RoutineModalPage;
  let fixture: ComponentFixture<RoutineModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutineModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
