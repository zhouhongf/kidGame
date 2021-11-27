import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedHomeComponent} from './shared-home/shared-home.component';
import {SharedAppComponent} from './shared-app/shared-app.component';
import {SharedComponent} from './shared.component';

const sharedRoutes: Routes = [{
    path: '', component: SharedComponent,
    children: [
        {path: 'home', component: SharedHomeComponent},
        {path: '', redirectTo: 'home', pathMatch: 'full'},
        {path: 'app', component: SharedAppComponent}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(sharedRoutes)],
    exports: [RouterModule]
})
export class SharedRoutingModule {
}
