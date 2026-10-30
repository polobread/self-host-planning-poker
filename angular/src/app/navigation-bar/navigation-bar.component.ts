import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { BaseHrefPipe } from "../shared/base-href.pipe";

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
  selector: 'shpp-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  imports: [TranslocoDirective, BaseHrefPipe],
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {

}
