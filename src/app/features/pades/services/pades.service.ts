import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { Pades } from '../models/pades.model';

@Injectable({
  providedIn: 'root'
})
export class PadesService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly padesItems = signal<Pades[]>(this.getFallbackSeed());
  private readonly initPromise: Promise<void>;

  readonly items = this.padesItems.asReadonly();

  constructor() {
    this.initPromise = this.isBrowser ? this.initializeItems() : Promise.resolve();
  }

  async addPatient(paciente: string, razon: string, descripcion: string): Promise<Pades | null> {
    await this.initPromise;

    const trimmedPaciente = paciente.trim();
    const trimmedRazon = razon.trim();
    const trimmedDescripcion = descripcion.trim();
    if (!trimmedPaciente || !trimmedRazon) {
      return null;
    }

    try {
      const response = await fetch('/api/pades-patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paciente: trimmedPaciente,
          razon: trimmedRazon,
          descripcion: trimmedDescripcion
        })
      });

      if (!response.ok) {
        return null;
      }

      const createdItem: unknown = await response.json();
      if (!this.isValidPadesItem(createdItem)) {
        return null;
      }

      const normalizedItem: Pades = {
        ...createdItem,
        razon: createdItem.razon ?? trimmedRazon,
        descripcion: createdItem.descripcion ?? trimmedDescripcion
      };

      this.padesItems.update((items) => [...items, normalizedItem]);
      return normalizedItem;
    } catch {
      return null;
    }
  }

  async updatePatient(id: number, paciente: string, razon: string, descripcion: string): Promise<Pades | null> {
    await this.initPromise;

    const trimmedPaciente = paciente.trim();
    const trimmedRazon = razon.trim();
    const trimmedDescripcion = descripcion.trim();
    if (!trimmedPaciente || !trimmedRazon) {
      return null;
    }

    try {
      const response = await fetch(`/api/pades-patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paciente: trimmedPaciente,
          razon: trimmedRazon,
          descripcion: trimmedDescripcion
        })
      });

      if (!response.ok) {
        return null;
      }

      const updatedItem: unknown = await response.json();
      if (!this.isValidPadesItem(updatedItem)) {
        return null;
      }

      const normalizedItem: Pades = {
        ...updatedItem,
        razon: updatedItem.razon ?? trimmedRazon,
        descripcion: updatedItem.descripcion ?? trimmedDescripcion
      };

      this.padesItems.update((items) =>
        items.map((item) => (item.id === id ? normalizedItem : item))
      );

      return normalizedItem;
    } catch {
      return null;
    }
  }

  getById(id: number): Pades | null {
    return this.padesItems().find((item) => item.id === id) ?? null;
  }

  private async initializeItems(): Promise<void> {
    const apiItems = await this.readFromApi();
    if (apiItems.length > 0) {
      this.padesItems.set(apiItems);
      return;
    }

    const seededItems = await this.readSeedJson();
    if (seededItems.length > 0) {
      this.padesItems.set(seededItems);
    }
  }

  private getFallbackSeed(): Pades[] {
    return [
      {
        id: 1,
        nombre: 'PADES Tarragona',
        paciente: 'Maria Soler',
        razon: 'Control de dolor cronico',
        descripcion: 'Control del dolor y seguimiento semanal domiciliario.',
        municipio: 'Tarragona',
        activo: true
      }
    ];
  }

  private async readFromApi(): Promise<Pades[]> {
    try {
      const response = await fetch('/api/pades-patients');
      if (!response.ok) {
        return [];
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        return [];
      }

      return data.filter(this.isValidPadesItem);
    } catch {
      return [];
    }
  }

  private async readSeedJson(): Promise<Pades[]> {
    try {
      const response = await fetch('/data/pades-patients.json');
      if (!response.ok) {
        return [];
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        return [];
      }

      return data.filter(this.isValidPadesItem);
    } catch {
      return [];
    }
  }

  private isValidPadesItem(value: unknown): value is Pades {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const candidate = value as Record<string, unknown>;
    return (
      typeof candidate['id'] === 'number' &&
      typeof candidate['nombre'] === 'string' &&
      typeof candidate['paciente'] === 'string' &&
      (typeof candidate['razon'] === 'string' || typeof candidate['razon'] === 'undefined') &&
      (typeof candidate['descripcion'] === 'string' || typeof candidate['descripcion'] === 'undefined') &&
      typeof candidate['municipio'] === 'string' &&
      typeof candidate['activo'] === 'boolean'
    );
  }
}
