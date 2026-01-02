import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadernoVirtualComponent } from './cuaderno-virtual.component';

describe('CuadernoVirtualComponent', () => {
  let component: CuadernoVirtualComponent;
  let fixture: ComponentFixture<CuadernoVirtualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuadernoVirtualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuadernoVirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
