import { Injectable, signal } from '@angular/core';

import { Pades } from '../models/pades.model';

@Injectable({
  providedIn: 'root'
})
export class PadesService {
  private readonly padesItems = signal<Pades[]>([
    {
      id: 1,
      nombre: 'PADES Tarragona',
      paciente: 'Maria Soler',
      municipio: 'Tarragona',
      activo: true
    }
  ]);

  readonly items = this.padesItems.asReadonly();

  getById(id: number): Pades | null {
    return this.padesItems().find((item) => item.id === id) ?? null;
  }
}
