import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn } from '@angular/forms';
import { LocalService } from '../../service/local.service';
import { TranslationRequest } from '../../service/translation.request';
import { LoggingService } from '../../helpers/logging.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-selector',
    providers: [LocalService],
    templateUrl: './selector.component.html',
    styleUrls: ['./selector.component.css']
})

export class SelectorComponent implements OnInit {

    public languages = [];

    form: FormGroup;

    languagesTable: Map<string, string>;

    routeFrom: string;

    routeTo: string;

    private logger = new LoggingService();

    @Output()
    public onSelected = new EventEmitter<TranslationRequest>();
    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private dataService: LocalService) {

            this.languagesTable = new Map<string, string>();
            this.form = this.fb.group({
                from: ['', [Validators.required]],
                to: ['', [Validators.required]],
                word: ['', [Validators.required]],
            });
    }

    get fromLanguage() { return this.form.get('from').value; }

    get toLanguage() { return this.form.get('to').value; }

    get selectedWord() { return this.form.get('word').value; }

    ngOnInit() {

        this.route.paramMap
                   .subscribe(params =>
                        this.selectParms(
                            params.get('from'),
                            params.get('to'),
                            params.get('word')));

        this.dataService
            .getLanguages()
            .subscribe(data => this.receivedLanguages(data));
    }

    public onSearch() {
        const item = new TranslationRequest();
        item.from = this.fromLanguage;
        item.to = this.toLanguage;
        item.word = this.selectedWord;
        this.onSelected.emit(item);
    }

    private selectParms(from: string, to: string, word: string) {
        this.routeFrom = from;
        this.routeTo = to;
        this.form.controls['word'].setValue(word);
        this.setDropDown();
    }

    private receivedLanguages(languages: string[]) {
        this.languagesTable = new Map<string, string>();
        this.languages = languages;
        languages.forEach((prop) => { this.languagesTable[prop.toLocaleLowerCase()] = prop; });
        this.setDropDown();
    }

    private setDropDown() {
        if (this.languages.length === 0) {
            this.logger.log('Languages not received yet');
            return;
        }

        let from = 'English';
        let to = 'Spanish';
        if (this.routeFrom != null) {
            from = this.languagesTable[this.routeFrom.toLocaleLowerCase()];
        }

        if (this.routeTo != null) {
            to = this.languagesTable[this.routeTo.toLocaleLowerCase()];
        }

        this.form.controls['from'].setValue(from);
        this.form.controls['to'].setValue(to);
    }
}

