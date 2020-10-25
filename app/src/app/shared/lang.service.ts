import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {TranslateService} from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class LangService {
  public readonly supportedLanguages = ['it', 'en'];
  public readonly defaultLanguage = 'en';

  public currLanguage: string;

  private readonly _storageKeyLanguage = 'language';

  constructor(private storage: Storage, private i18n: TranslateService) {
  }

  async initAppLanguage(): Promise<void> {
    this.i18n.addLangs(this.supportedLanguages);
    this.i18n.setDefaultLang(this.defaultLanguage);

    await this.setAppLanguage();
  }

  private async setAppLanguage(): Promise<void> {
    const savedLang = await this.storage.get(this._storageKeyLanguage);

    if (savedLang && this.supportedLanguages.includes(savedLang)) {
      await this.useLanguage(savedLang);
      return;
    }

    const systemLang = this.i18n.getBrowserLang();

    if (systemLang && this.supportedLanguages.includes(systemLang)) {
      await this.useLanguage(systemLang);
      return;
    }

    await this.useLanguage(this.defaultLanguage);
  }

  async useLanguage(lang: string): Promise<void> {
    this.i18n.use(lang);

    await this.saveAppLanguage(lang);

    this.currLanguage = lang;
  }

  async saveAppLanguage(lang: string): Promise<void> {
    await this.storage.set(this._storageKeyLanguage, lang);
  }
}
