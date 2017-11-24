import { AppComponent } from './app.component';

export const DictionaryAppRoutes = [
    { path: '', component: AppComponent },
    { path: ':from/:to', component: AppComponent }
];