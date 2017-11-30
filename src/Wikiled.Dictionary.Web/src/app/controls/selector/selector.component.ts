import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
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

    public form: FormGroup;

    public languages: string[];

    @Output()
    public onSelected = new EventEmitter<TranslationRequest>();

    private languagesLower: string[];

    constructor(private fb: FormBuilder, private route: ActivatedRoute, private dataService: LocalService) {
    }

    get fromLanguage() { return this.form.get('from'); }

    get toLanguage() { return this.form.get('to'); }

    get selectedWord() { return this.form.get('word'); }

    ngOnInit() {
        this.languagesLower = [];
        this.form = this.fb.group({
            from: ['', [Validators.required, this.isValidList]],
            to: ['', [Validators.required]],
            word: ['', [Validators.required]],
        });

        this.route.paramMap.subscribe(
            item => {
                this.form.controls['from'].setValue(item.get('from'));
                this.form.controls['to'].setValue(item.get('to'));
                this.form.controls['word'].setValue(item.get('word'));
            });

        this.dataService
            .getLanguages()
            .subscribe((data) => {
                this.languages = data;
                this.languagesLower = data.map(item => item.toLocaleLowerCase());
            });
    }

    public onSearch() {
        const item = new TranslationRequest();
        // item.from = this.fromLanguage;
        // item.to = this.toLanguage;
        // item.word = this.selectedWord;
        this.onSelected.emit(item);
    }

    private isValidList(input: FormControl) {
        return this.languagesLower != null && this.languagesLower.length > 0 && this.languagesLower.includes(input.value);
      }
}
