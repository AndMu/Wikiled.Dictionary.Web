import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LocalService } from '../../service/local.service';
import { TranslationRequest } from '../../service/translation.request';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-selector',
    providers: [LocalService],
    templateUrl: './selector.component.html',
    styleUrls: ['./selector.component.css']
})

export class SelectorComponent implements OnInit {

    public isInvalid = true;

    public languages: string[];

    @Output()
    public selectedWord: string;

    @Output()
    public toLanguage: string;

    @Output()
    public fromLanguage: string;

    @Output()
    public onSelected = new EventEmitter<TranslationRequest>();

    private languagesLower: string[];

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
            .subscribe((data) => {
                this.languages = data;
                this.languagesLower = data.map(item => item.toLocaleLowerCase());
                this.onValueChange('initial');
            });
    }

    public onSearchClick() {
        const item = new TranslationRequest();
        item.from = this.fromLanguage;
        item.to = this.toLanguage;
        item.word = this.selectedWord;
        this.onSelected.emit(item);
    }

    public onValueChange(event) {
        this.isInvalid =
            !this.languagesLower.includes(this.fromLanguage) ||
            !this.languagesLower.includes(this.toLanguage) ||
            this.selectedWord == null || this.selectedWord.length === 0;
    }
}
