import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Pades } from '../../models/pades.model';

@Component({
  selector: 'app-pades-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pades-detail.component.html',
  styleUrl: './pades-detail.component.scss'
})
export class PadesDetailComponent {
  readonly item = input<Pades | null>(null);
}
