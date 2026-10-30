import { TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { describe, expect, it, vi } from 'vitest';
import english from '../../../assets/i18n/en.json';
import { decksDict } from '../../model/deck';
import { GameFormComponent } from './game-form.component';

function createForm() {
  TestBed.configureTestingModule({
    imports: [GameFormComponent, TranslocoTestingModule.forRoot({
      langs: { en: english },
      translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
      preloadLangs: true
    })]
  });
  return TestBed.createComponent(GameFormComponent);
}

describe('Game form', () => {
  it('requires a name and submits the chosen deck from the actual controls', async () => {
    const fixture = createForm();
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement;
    const button = host.querySelector('button')!;
    expect(button.disabled).toBe(true);
    const submitted = vi.fn();
    fixture.componentInstance.gameOutput.subscribe(submitted);
    const name = host.querySelector('input')!;
    name.value = 'Sprint planning';
    name.dispatchEvent(new Event('input'));
    const deck = host.querySelector('select')!;
    deck.selectedIndex = 2;
    deck.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(button.disabled).toBe(false);
    button.click();
    expect(submitted).toHaveBeenCalledWith({
      name: 'Sprint planning', deck: decksDict['POWERS']
    });
  });

  it('preserves an existing game name and deck when editing', async () => {
    const fixture = createForm();
    fixture.componentRef.setInput('name', 'Existing room');
    fixture.componentRef.setInput('deck', 'T_SHIRTS');
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('input')!.value).toBe('Existing room');
    expect(host.querySelector('select')!.selectedOptions[0].textContent).toContain('T-Shirt');
    expect(host.querySelector('button')!.textContent).toContain('Update');
  });
});
