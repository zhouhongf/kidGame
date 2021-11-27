import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {IonicStorageModule} from '@ionic/storage';
import {SQLite} from '@ionic-native/sqlite/ngx';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {NativeAudio} from "@ionic-native/native-audio/ngx";
import {TextToSpeech} from "@ionic-native/text-to-speech/ngx";
import {SpeechRecognition} from '@ionic-native/speech-recognition/ngx';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot({
            name: 'myworld_db',
            driverOrder: ['indexeddb', 'sqlite', 'websql', 'localstorage']
        }),
        AppRoutingModule,
        MatToolbarModule,
        MatExpansionModule,
        MatListModule,
        MatButtonModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        SQLite,
        NativeAudio,
        TextToSpeech,
        SpeechRecognition,
        // {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
