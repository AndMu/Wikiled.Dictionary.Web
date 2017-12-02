import { Component, Input, OnInit } from '@angular/core';
import { LocalService } from '../../service/local.service';
import { TranslationResult } from '../../service/translation.result';

@Component({
    selector: 'app-results',
    providers: [LocalService],
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.css']
})

export class ResultsComponent implements OnInit  {

    @Input()
    public results: TranslationResult;

    ngOnInit() {
    }
}
