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
    public toLanguage: string;

    @Output()
    public fromLanguage: string;

    constructor(private route: ActivatedRoute, private dataService: LocalService) {
    }

    ngOnInit() {
        this.fromLanguage = this.route.snapshot.paramMap.get('from');
        this.toLanguage = this.route.snapshot.paramMap.get('to');
        this.dataService
        .getLanguages()
        .subscribe((data) => this.languages = data);
    }

    public onSearchClick() {
    }
}
