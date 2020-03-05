import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { TranslateService } from "@ngx-translate/core";


@Injectable({ providedIn: 'root' })
export class LangService {

    public readonly supportedLanguages = ["it", "en"];
    public readonly defaultLanguage    = "en";

    private readonly _storageKeyLanguage = "language";


    constructor(private storage: Storage, private i18n: TranslateService) { }


    /** Initializes the application language. */
    async initAppLanguage(): Promise<void> {

        this.i18n.addLangs(this.supportedLanguages);
        this.i18n.setDefaultLang(this.defaultLanguage);

        await this.setAppLanguage();

    }


    /** Sets the application language. */
    private async setAppLanguage(): Promise<void> {

        // Try to recover the saved language from the local storage
        const savedLang = await this.storage.get(this._storageKeyLanguage);

        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.useLanguage(savedLang);
            return;
        }

        // Get the current system language
        const systemLang = this.i18n.getBrowserLang();

        if (systemLang && this.supportedLanguages.includes(systemLang)) {
            this.useLanguage(systemLang);
            return;
        }

        // Fallback on the default language
        this.useLanguage(this.defaultLanguage);

    }


    /**
     * Make the application use the given language.
     *
     * @param {string} lang - The language to use.
     */
    async useLanguage(lang: string): Promise<void> {

        this.i18n.use(lang);

        await this.saveAppLanguage(lang);

    }


    /**
     * Save the current language of the application into the local storage of the phone.
     *
     * @param {string} lang - The language to save.
     */
    async saveAppLanguage(lang: string): Promise<void> {

        await this.storage.set(this._storageKeyLanguage, lang);

    }


}
