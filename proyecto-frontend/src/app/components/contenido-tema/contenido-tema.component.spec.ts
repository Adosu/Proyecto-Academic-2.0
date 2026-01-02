import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoTemaComponent } from './contenido-tema.component';

describe('ContenidoTemaComponent', () => {
  let component: ContenidoTemaComponent;
  let fixture: ComponentFixture<ContenidoTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContenidoTemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenidoTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
