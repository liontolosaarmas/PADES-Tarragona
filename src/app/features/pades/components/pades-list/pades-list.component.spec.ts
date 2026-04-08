import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PadesListComponent } from './pades-list.component';

describe('PadesListComponent', () => {
  let component: PadesListComponent;
  let fixture: ComponentFixture<PadesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PadesListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PadesListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', [
      {
        id: 1,
        nombre: 'PADES Tarragona Nord',
        paciente: 'Maria Soler',
        municipio: 'Tarragona',
        activo: true
      }
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
