import { BrowserModule } from '@angular/platform-browser';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { PanelBarModule } from '@progress/kendo-angular-layout';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import {
    MatButtonModule, MatCheckboxModule, MatInputModule, MatAutocompleteModule, MatProgressSpinnerModule
} from '@angular/material';
import { AngularWebStorageModule } from 'angular-web-storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';
import { AppComponent } from './app.component';
import { RoutedComponent } from './routed.app.component';
import { DictionaryAppRoutes } from './routes';
import { AppNavbarComponent } from './controls/navbar/navbar.component';
import { SelectorComponent } from './controls/selector/selector.component';
import { ResultsComponent } from './controls/results/results.component';


@NgModule({
    declarations: [
        AppComponent,
        SelectorComponent,
        AppNavbarComponent,
        RoutedComponent,
        ResultsComponent
    ],
    imports: [
        AngularWebStorageModule,
        DialogModule,
        LayoutModule,
        PanelBarModule,
        MatProgressSpinnerModule,
        DropDownsModule,
        MatListModule,
        LabelModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        MatInputModule,
        MatAutocompleteModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCheckboxModule,
        ButtonsModule,
        InputsModule,
        NgbModule.forRoot(),
        RouterModule.forRoot(DictionaryAppRoutes)
    ],
    providers: [],
    bootstrap: [RoutedComponent]
})
export class AppModule { }
