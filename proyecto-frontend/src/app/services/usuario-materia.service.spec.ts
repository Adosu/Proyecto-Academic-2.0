import { TestBed } from '@angular/core/testing';

import { UsuarioMateriaService } from './usuario-materia.service';

describe('UsuarioMateriaService', () => {
  let service: UsuarioMateriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioMateriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
