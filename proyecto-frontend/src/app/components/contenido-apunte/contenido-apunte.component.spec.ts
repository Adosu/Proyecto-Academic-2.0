import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoApunteComponent } from './contenido-apunte.component';

describe('ContenidoApunteComponent', () => {
  let component: ContenidoApunteComponent;
  let fixture: ComponentFixture<ContenidoApunteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContenidoApunteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenidoApunteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
