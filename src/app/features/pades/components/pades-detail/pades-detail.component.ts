import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Pades } from '../../models/pades.model';

@Component({
  selector: 'app-pades-detail',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pades-detail.component.html',
  styleUrl: './pades-detail.component.scss'
})
export class PadesDetailComponent {
  readonly item = input<Pades | null>(null);
  readonly patientAdded = output<{ patientName: string; reason: string; description: string }>();
  readonly patientUpdated = output<{ id: number; patientName: string; reason: string; description: string }>();
  readonly isCreateFormOpen = signal(false);
  readonly isEditFormOpen = signal(false);

  readonly patientNameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2)]
  });

  readonly descriptionControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.maxLength(280)]
  });

  readonly reasonControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3), Validators.maxLength(120)]
  });

  openCreateForm(): void {
    this.isEditFormOpen.set(false);
    this.isCreateFormOpen.set(true);
  }

  openEditForm(): void {
    const selectedItem = this.item();
    if (!selectedItem) {
      return;
    }

    this.isCreateFormOpen.set(false);
    this.isEditFormOpen.set(true);
    this.patientNameControl.setValue(selectedItem.paciente);
    this.reasonControl.setValue(selectedItem.razon ?? '');
    this.descriptionControl.setValue(selectedItem.descripcion ?? '');
  }

  cancelCreateForm(): void {
    this.isCreateFormOpen.set(false);
    this.isEditFormOpen.set(false);
    this.patientNameControl.reset('');
    this.reasonControl.reset('');
    this.descriptionControl.reset('');
  }

  savePatient(): void {
    const patientName = this.patientNameControl.value.trim();
    const reason = this.reasonControl.value.trim();

    if (!patientName || !reason) {
      this.patientNameControl.markAsTouched();
      this.reasonControl.markAsTouched();
      return;
    }

    this.patientAdded.emit({
      patientName,
      reason,
      description: this.descriptionControl.value.trim()
    });

    this.cancelCreateForm();
  }

  saveEditedPatient(): void {
    const selectedItem = this.item();
    if (!selectedItem) {
      return;
    }

    const patientName = this.patientNameControl.value.trim();
    const reason = this.reasonControl.value.trim();

    if (!patientName || !reason) {
      this.patientNameControl.markAsTouched();
      this.reasonControl.markAsTouched();
      return;
    }

    this.patientUpdated.emit({
      id: selectedItem.id,
      patientName,
      reason,
      description: this.descriptionControl.value.trim()
    });

    this.cancelCreateForm();
  }
}
