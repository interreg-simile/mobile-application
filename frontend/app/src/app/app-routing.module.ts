import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'news', pathMatch: 'full' },
    { path: 'map', loadChildren: './map/map.module#MapPageModule' },
    {
        path: 'surveys', children: [
            { path: "", loadChildren: './surveys/surveys.module#SurveysPageModule' },
            { path: ":surveyId", loadChildren: './surveys/survey/survey.module#SurveyPageModule' }
        ]
    },
    {
        path: 'news', children: [
            { path: "", loadChildren: './news/news.module#NewsPageModule' },
            {
                path        : 'alert/:id',
                loadChildren: './news/alerts/single-alert/single-alert.module#SingleAlertPageModule'
            },
            {
                path        : 'event/:id',
                loadChildren: './news/events/single-event/single-event.module#SingleEventPageModule'
            }
        ]
    },
    { path: 'info', loadChildren: './info/info.module#InfoPageModule' },
    { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
    { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
