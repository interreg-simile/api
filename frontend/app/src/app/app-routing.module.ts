import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'map', pathMatch: 'full' },
    { path: 'map', loadChildren: './map/map.module#MapPageModule' },
    { path: 'surveys', loadChildren: './surveys/surveys.module#SurveysPageModule' },
    { path: 'events', loadChildren: './events/events.module#EventsPageModule' },
    { path: 'info', loadChildren: './info/info.module#InfoPageModule' },
    { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
