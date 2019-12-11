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
        path: 'events', children: [
            { path: "", loadChildren: './events/events.module#EventsPageModule' },
            {
                path        : "communication/:id",
                loadChildren: './events/communication-single/communication-single.module#CommunicationSinglePageModule'
            }
        ]
    },
    { path: 'info', loadChildren: './info/info.module#InfoPageModule' },
    { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
    { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
    { path: 'news', loadChildren: './news/news.module#NewsPageModule' }


];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
