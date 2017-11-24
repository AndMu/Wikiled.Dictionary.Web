import { AppComponent } from './app.component';

// https://blog.thoughtram.io/angular/2016/06/14/routing-in-angular-2-revisited.html
export const DictionaryAppRoutes = [
    { path: '', component: AppComponent },
    { path: ':from/:to', component: AppComponent }
];

