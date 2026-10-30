import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../i18n/language.service';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'shpp-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [TranslocoDirective, FormsModule]
})
export class FooterComponent {
  constructor(public readonly language: LanguageService) {}
}
