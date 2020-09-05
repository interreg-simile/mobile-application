import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { ModalController } from "@ionic/angular";
import { TermModalComponent } from "./term-modal/term-modal.component";

@Component({ selector: 'app-glossary', templateUrl: './glossary.page.html', styleUrls: ['./glossary.page.scss'] })
export class GlossaryPage implements OnInit {

    private readonly _wordsNumber = 27;

    public _terms: { [key: string]: Array<{ idx: number, term: string }> } = {};

    public isLoading = false;

    alphabeticalOrderTerms = (a, b) => { return a.value.term.localeCompare(b.value.term) };

    constructor(private i18n: TranslateService, private modalCtr: ModalController) { }

    ngOnInit(): void {
        this.isLoading = true;
    }

    ionViewWillEnter() {
        this.orderTerms();
    }

    private orderTerms(): void {

        const unorderedTerms = {};

        for (let i = 1; i < this._wordsNumber + 1; i++) {
            const term        = this.i18n.instant(`page-glossary.${ i }.title`);
            const firstLetter = term.charAt(0).toLowerCase();

            if (!unorderedTerms[firstLetter]) unorderedTerms[firstLetter] = [];
            unorderedTerms[firstLetter].push({ idx: i, term: term });
        }

        Object.keys(unorderedTerms).sort().forEach(k => this._terms[k] = unorderedTerms[k]);

        this.isLoading = false;

    }

    async openTermModal(idx: number): Promise<void> {

        const modal = await this.modalCtr.create({
            component     : TermModalComponent,
            componentProps: { id: idx }
        });

        await modal.present();

    }

}
