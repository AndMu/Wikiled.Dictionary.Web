import { Component } from '@angular/core';
import {TranslationResult} from './service/translation.result';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    public results: TranslationResult;

    public onResult(query: TranslationResult) {
        this.results = query;
    }
}
