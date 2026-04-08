import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Pades } from '../../models/pades.model';

@Component({
  selector: 'app-pades-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pades-list.component.html',
  styleUrl: './pades-list.component.scss'
})
export class PadesListComponent {
  readonly items = input.required<Pades[]>();
  readonly selectedId = input<number | null>(null);
  readonly selected = output<number>();

  selectPades(id: number): void {
    this.selected.emit(id);
  }
}
