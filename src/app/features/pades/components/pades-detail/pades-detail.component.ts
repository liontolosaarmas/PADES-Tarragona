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
  readonly isCreateFormOpen = signal(false);

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
    this.isCreateFormOpen.set(true);
  }

  cancelCreateForm(): void {
    this.isCreateFormOpen.set(false);
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
}
