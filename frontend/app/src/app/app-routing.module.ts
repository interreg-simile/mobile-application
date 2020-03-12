import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    { path: "", redirectTo: "map", pathMatch: "full" },
    { path: "auth", loadChildren: "./auth/auth.module#AuthPageModule" },
    { path: "map", loadChildren: "./map/map.module#MapPageModule" },
    {
        path: "observations", children: [
            { path: "", redirectTo: "/observations/new", pathMatch: "full" },
            {
                path        : "new",
                loadChildren: "./observations/new-observation/new-observation.module#NewObservationPageModule"
            },
            {
                path        : ":id",
                loadChildren: "./observations/info/info.module#InfoPageModule"
            }
        ]
    },
    {
        path: "news", children: [
            { path: "", loadChildren: "./news/news.module#NewsPageModule" },
            {
                path        : "alerts/:id",
                loadChildren: "./news/alerts/single-alert/single-alert.module#SingleAlertPageModule"
            },
            {
                path        : "events/:id",
                loadChildren: "./news/events/single-event/single-event.module#SingleEventPageModule"
            }
        ]
    },
    { path: "project", loadChildren: "./project/project.module#ProjectPageModule" },
    { path: "settings", loadChildren: "./settings/settings.module#SettingsPageModule" }
];


@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
