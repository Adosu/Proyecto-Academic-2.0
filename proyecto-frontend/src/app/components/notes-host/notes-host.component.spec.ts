import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesHostComponent } from './notes-host.component';

describe('NotesHostComponent', () => {
  let component: NotesHostComponent;
  let fixture: ComponentFixture<NotesHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotesHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
