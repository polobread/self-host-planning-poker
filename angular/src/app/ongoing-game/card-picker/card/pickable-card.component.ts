import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardValue } from '../../../model/deck';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'shpp-pickable-card',
    templateUrl: './pickable-card.component.html',
    styleUrls: ['./pickable-card.component.scss'],
    standalone: true
})
export class PickableCardComponent {
  @Input() cardValue?: CardValue;
  @Input() selected = false;
  @Input() disabled = false;

}
