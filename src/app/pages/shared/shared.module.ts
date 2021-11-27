import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ToolModule} from '../../tool/tool.module';
import {SharedComponent} from './shared.component';
import {SharedHomeComponent} from './shared-home/shared-home.component';
import {SharedAppComponent} from './shared-app/shared-app.component';
import {SharedRoutingModule} from './shared-routing.module';


@NgModule({
    imports: [
        IonicModule,
        ToolModule,
        SharedRoutingModule
    ],
    declarations: [
        SharedComponent,
        SharedHomeComponent,
        SharedAppComponent,
    ]
})
export class SharedModule {
}
