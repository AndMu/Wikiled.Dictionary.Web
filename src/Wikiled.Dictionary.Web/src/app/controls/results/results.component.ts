import { Component, Input, OnInit } from '@angular/core';
import { LocalService } from '../../service/local.service';

@Component({
    selector: 'app-results',
    providers: [LocalService],
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.css']
})

export class ResultsComponent implements OnInit  {

    @Input()
    public words: string[];

    ngOnInit() {
        this.words = [];
    }
}
