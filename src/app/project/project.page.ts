import { Component } from '@angular/core';


@Component({ selector: 'app-project', templateUrl: './project.page.html', styleUrls: ['./project.page.scss'] })
export class ProjectPage {

    public projectUrl = "https://progetti.interreg-italiasvizzera.eu/it/b/78/sistemainformativoperilmonitoraggiointegratodeilaghiinsubriciedeiloroe"


    ionViewDidEnter() {

        const links = document.querySelectorAll("a");
        links.forEach(l => l.addEventListener("click", () => this.onLinkClick()))

    }


    onLinkClick(): void { window.open(this.projectUrl, "_system", "location=yes") }

}
