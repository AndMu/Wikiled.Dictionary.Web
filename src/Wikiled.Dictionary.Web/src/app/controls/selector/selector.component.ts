import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn } from '@angular/forms';
import { LocalService } from '../../service/local.service';
import { TranslationRequest } from '../../service/translation.request';
import { LoggingService } from '../../helpers/logging.service';
import { ActivatedRoute } from '@angular/router';
import { TranslationResult } from '../../service/translation.result';

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
    public onResult = new EventEmitter<TranslationResult>();

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

    get toLanguage() { return this.form.get('to').value; }

    get selectedWord() { return this.form.get('word').value; }

    get fromLanguage() { return this.form.get('from').value; }

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
        this.logger.log('onSearch');
        this.search(this.fromLanguage, this.toLanguage, this.selectedWord);
    }

    public search(from: string, to: string, word: string) {
        this.logger.log(`search: ${from}-${to}:${word}`);
        const item = new TranslationRequest();
        item.from = from;
        item.to = to;
        item.word = word;
        this.dataService.getTranslation(item).subscribe(result => {
            this.logger.log('search - received');
            this.onResult.emit(result);
        });
    }

    private selectParms(from: string, to: string, word: string) {
        this.routeFrom = from;
        this.routeTo = to;
        this.form.controls['word'].setValue(word);
        this.setDropDown();
        if (from != null && to != null && word != null) {
            this.logger.log('All initial arguments set. Searchings...');
            this.search(from, to, word);
        }
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

        this.logger.log('Setting dropdown');

        let from = 'English';
        let to = 'Spanish';
        if (this.routeFrom != null) {
            from = this.languagesTable[this.routeFrom.toLocaleLowerCase()];
        }

        if (this.routeTo != null) {
            to = this.languagesTable[this.routeTo.toLocaleLowerCase()];
        }

        this.form.controls['to'].setValue(to);
        this.form.controls['from'].setValue(from);
    }
}

