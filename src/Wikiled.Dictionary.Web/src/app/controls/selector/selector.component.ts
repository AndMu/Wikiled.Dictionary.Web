import { Component } from '@angular/core';
import { LocalService } from '../../service/local.service';

@Component({
    selector: 'app-selector',
    providers: [LocalService],
    templateUrl: './selector.component.html',
    styleUrls: ['./selector.component.css']
})
export class SelectorComponent {

    public languages: string[];

    constructor(private dataService: LocalService) {
    }

    ngOnInit() {
        this.dataService.getLanguages().subscribe(
            (data) => this.languages = data);
    }

    public onSearchClick() {

    }
}