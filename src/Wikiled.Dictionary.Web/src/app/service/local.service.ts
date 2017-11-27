import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TranslationResult } from './translation.result';

@Injectable()
export class LocalService {
    constructor(private http: HttpClient) {
    }

    public getLanguages(): Observable<string[]> {
        return this.http.get<string[]>(`api/dictionary/languages`);
    }

    public getTranslation(from: string, to: string, word: string): Observable<TranslationResult> {
        return this.http.get<TranslationResult>(`${from}/${to}/${word}`);
    }
}

