import { Component, OnInit } from '@angular/core';
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { Map, tileLayer } from 'leaflet';

@Component({
    selector   : 'app-map',
    templateUrl: './map.page.html',
    styleUrls  : ['./map.page.scss'],
})
export class MapPage implements OnInit {

    private _map: Map;

    private _selectedTab = "reports";

    constructor(private statusBar: StatusBar) { }

    ngOnInit() {

        this.statusBar.overlaysWebView(true);
        this.statusBar.backgroundColorByHexString("#000000");

    }

    ionViewDidEnter() { this.initMap() }

    ionViewWillLeave() { this._map.remove() }

    segmentChanged($event: CustomEvent) {

        this._selectedTab = $event.detail.value;

        console.log(this._selectedTab);

    }

    initMap() {

        this._map = new Map("map", { attributionControl: false, zoomControl: false });

        this._map.setView([45.466342, 9.185291], 10);

        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this._map);

    }

    add() {
        console.log("Clicked add button")
    }
}