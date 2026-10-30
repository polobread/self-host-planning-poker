import { DOCUMENT } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService, TranslocoTestingModule } from '@jsverse/transloco';
import { provideTranslocoLocale, TranslocoLocaleService } from '@jsverse/transloco-locale';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import english from '../../../assets/i18n/en.json';
import chinese from '../../../assets/i18n/zh.json';
import { FooterComponent } from '../footer/footer.component';
import { GameFormComponent } from '../game-form/game-form.component';
import { LanguageService } from './language.service';

@Component({
  imports: [GameFormComponent, FooterComponent],
  template: '<shpp-game-form /><shpp-footer />'
})
class LanguagePageComponent {}

const storageKey = 'planning-poker.language';
let originalLanguage: string;

beforeEach(() => {
  originalLanguage = document.documentElement.lang;
  localStorage.removeItem(storageKey);
  TestBed.configureTestingModule({
    imports: [LanguagePageComponent, TranslocoTestingModule.forRoot({
      langs: { en: english, zh: chinese },
      translocoConfig: {
        availableLangs: ['en', 'zh'], defaultLang: 'en', fallbackLang: 'en', reRenderOnLangChange: true
      },
      preloadLangs: true
    })],
    providers: [provideTranslocoLocale({ langToLocaleMapping: { en: 'en-US', zh: 'zh-TW' } })]
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.removeItem(storageKey);
  document.documentElement.lang = originalLanguage;
});

async function openPage(browserLanguage: string) {
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue([browserLanguage]);
  TestBed.inject(LanguageService).initialize();
  const fixture = TestBed.createComponent(LanguagePageComponent);
  await fixture.whenStable();
  return fixture;
}

describe('Taiwan Traditional Chinese', () => {
  it.each(['zh-TW', 'zh-Hant-TW'])('shows Chinese controls for %s and uses the Taiwan locale', async browserLanguage => {
    const fixture = await openPage(browserLanguage);
    const host: HTMLElement = fixture.nativeElement;
    expect(host.textContent).toContain('房間名稱');
    expect(host.textContent).toContain('建立房間');
    expect(host.textContent).toContain('Fibonacci');
    expect(host.querySelector<HTMLSelectElement>('#language-select')!.value).toBe('zh');
    expect(document.documentElement.lang).toBe('zh-Hant-TW');
    expect(TestBed.inject(TranslocoLocaleService).getLocale()).toBe('zh-TW');
    expect(TestBed.inject(TranslocoService).translate('errors.disconnect', { reason: 'offline', delay: 5 }))
      .toContain('將在 5 秒後重新連線');
  });

  it('preserves the browser region for existing non-Chinese languages', async () => {
    await openPage('en-GB');
    expect(TestBed.inject(TranslocoLocaleService).getLocale()).toBe('en-GB');
  });

  it('switches the actual form to Chinese and restores the preference over an English browser', async () => {
    const fixture = await openPage('en-US');
    const host: HTMLElement = fixture.nativeElement;
    expect(host.textContent).toContain("Game's name");
    const select = host.querySelector<HTMLSelectElement>('#language-select')!;
    select.value = 'zh';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(host.textContent).toContain('房間名稱');
    expect(host.textContent).not.toContain("Game's name");
    expect(localStorage.getItem(storageKey)).toBe('zh');
    TestBed.inject(TranslocoService).setActiveLang('en');
    TestBed.inject(LanguageService).initialize();
    await fixture.whenStable();
    expect(host.querySelector<HTMLSelectElement>('#language-select')!.value).toBe('zh');
    expect(host.textContent).toContain('房間名稱');
    expect(document.documentElement.lang).toBe('zh-Hant-TW');
  });

  it('uses English for an unsupported browser language without requesting a missing translation', async () => {
    const fixture = await openPage('zz-ZZ');
    expect(TestBed.inject(TranslocoService).getActiveLang()).toBe('en');
    expect(fixture.nativeElement.textContent).toContain("Game's name");
    expect(document.documentElement.lang).toBe('en');
  });

  it('still switches language when browser storage is blocked', async () => {
    const storage = TestBed.inject(DOCUMENT).defaultView!.localStorage;
    vi.spyOn(Object.getPrototypeOf(storage), 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Object.getPrototypeOf(storage), 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const fixture = await openPage('zh-TW');
    expect(fixture.nativeElement.textContent).toContain('房間名稱');
    TestBed.inject(LanguageService).selectLanguage('en');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain("Game's name");
  });
});
