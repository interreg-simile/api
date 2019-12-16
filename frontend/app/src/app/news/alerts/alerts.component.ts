import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

import { Alert } from "./alert.model";


@Component({ selector: 'app-alerts', templateUrl: './alerts.component.html', styleUrls: ['./alerts.component.scss'] })
export class AlertsComponent implements OnInit {

    /** Array of alerts to display. */
    @Input() alerts: Alert[];

    /** Flag that states if an error occurred. */
    @Input() hasError: boolean;

    /** Current locale of the application. */
    public locale: string;


    /** @ignore */
    constructor(private i18n: TranslateService) { }


    /** @ignore */
    ngOnInit() {

        // Retrieve the current locale
        this.locale = this.i18n.currentLang;

    }

}
