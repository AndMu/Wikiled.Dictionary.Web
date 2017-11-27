import { Component, OnInit, Output } from '@angular/core';
import { LocalService } from '../../service/local.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-selector',
    providers: [LocalService],
    templateUrl: './selector.component.html',
    styleUrls: ['./selector.component.css']
})

export class SelectorComponent implements OnInit {

    public languages: string[];

    @Output()
    public selectedWord: string;

    @Output()
    public toLanguage: string;

    @Output()
    public fromLanguage: string;

    constructor(private route: ActivatedRoute, private dataService: LocalService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(
            item => {
                this.fromLanguage = item.get('from');
                this.toLanguage = item.get('to');
                this.selectedWord = item.get('word');
            });

        this.dataService
        .getLanguages()
        .subscribe((data) => this.languages = data);
    }

    public onSearchClick() {
    }
}
