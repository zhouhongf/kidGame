import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {path: '', redirectTo: 'mains', pathMatch: 'full'},
    {path: 'mains', loadChildren: () => import('./pages/mains/mains.module').then(m => m.MainsModule)},
    { path: 'shared', loadChildren: () => import('./pages/shared/shared.module').then(m => m.SharedModule)},
];

@NgModule({
    imports: [
        // RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
