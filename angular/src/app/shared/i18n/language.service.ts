import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { getBrowserCultureLang, getBrowserLang, TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';

const storageKey = 'planning-poker.language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly transloco = inject(TranslocoService);
  private readonly locale = inject(TranslocoLocaleService);

  readonly languages = this.transloco.getAvailableLangs().map(language => {
    const id = typeof language === 'string' ? language : language.id;
    return {
      id,
      label: id === 'zh' ? '繁體中文（台灣）' : new Intl.DisplayNames([id], { type: 'language' }).of(id) ?? id
    };
  });

  get activeLanguage(): string {
    return this.transloco.getActiveLang();
  }

  initialize(): void {
    let saved: string | null = null;
    try {
      saved = this.document.defaultView?.localStorage.getItem(storageKey) ?? null;
    } catch {
      // Browser privacy settings may disable local storage.
    }
    const browserLanguage = getBrowserLang() ?? 'en';
    this.selectLanguage(saved && this.isAvailable(saved) ? saved : browserLanguage, false);
    if (!saved && browserLanguage !== 'zh' && this.isAvailable(browserLanguage)) {
      this.locale.setLocale(getBrowserCultureLang());
    }
  }

  selectLanguage(language: string, persist = true): void {
    const selected = this.isAvailable(language) ? language : 'en';
    this.transloco.setActiveLang(selected);
    this.locale.setLocale(selected === 'zh' ? 'zh-TW' : selected);
    this.document.documentElement.lang = selected === 'zh' ? 'zh-Hant-TW' : selected;
    if (persist) {
      try {
        this.document.defaultView?.localStorage.setItem(storageKey, selected);
      } catch {
        // Language switching still works without persistent storage.
      }
    }
  }

  private isAvailable(language: string): boolean {
    return this.languages.some(item => item.id === language);
  }
}
