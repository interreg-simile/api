import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

import { Event } from "./event.model";


@Component({ selector: 'app-events', templateUrl: './events.component.html', styleUrls: ['./events.component.scss'] })
export class EventsComponent implements OnInit {

    /** Array of alerts to display. */
    @Input() events: Event[];

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
