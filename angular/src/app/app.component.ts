import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './shared/i18n/language.service';
import { ToastsContainerComponent } from './shared/toast/toast-container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'shpp-root',
    templateUrl: './app.component.html',
    styles: [],
    standalone: true,
    imports: [RouterOutlet, ToastsContainerComponent]
})
export class AppComponent {

  constructor(language: LanguageService) {
    language.initialize();
  }
}
