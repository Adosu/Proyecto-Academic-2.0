import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemindersHostComponent } from './reminders-host.component';

describe('RemindersHostComponent', () => {
  let component: RemindersHostComponent;
  let fixture: ComponentFixture<RemindersHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemindersHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemindersHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
