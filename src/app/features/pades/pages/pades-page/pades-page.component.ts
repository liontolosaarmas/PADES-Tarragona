import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { PadesDetailComponent } from '../../components/pades-detail/pades-detail.component';
import { PadesListComponent } from '../../components/pades-list/pades-list.component';
import { PadesService } from '../../services/pades.service';
import { log } from 'console';

@Component({
  selector: 'app-pades-page',
  imports: [PadesListComponent, PadesDetailComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pades-page.component.html',
  styleUrl: './pades-page.component.scss'
})
export class PadesPageComponent {
  private readonly padesService = inject(PadesService);
  readonly selectedId = signal<number | null>(null);

  readonly items = this.padesService.items;
  readonly selectedItem = computed(() => {
    const id = this.selectedId();
    return id === null ? null : this.padesService.getById(id);
  });

  constructor() {
    const firstItem = this.items()[0];
    if (firstItem) {
      this.selectedId.set(firstItem.id);
    }
  }

  onSelectPades(id: number): void {
    this.selectedId.set(id);
  }

  async onAddPatient(payload: { patientName: string; reason: string; description: string }): Promise<void> {
    const newItem = await this.padesService.addPatient(payload.patientName, payload.reason, payload.description);
    if (newItem) {
      this.selectedId.set(newItem.id);
    }
  }
}
