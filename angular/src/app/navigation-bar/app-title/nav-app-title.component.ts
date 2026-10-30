import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'shpp-nav-app-title',
  templateUrl: './nav-app-title.component.html',
  standalone: true,
  imports: [ TranslocoDirective ]
})
export class NavAppTitleComponent {

}
