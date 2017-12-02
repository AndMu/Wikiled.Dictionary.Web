import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TranslationResult } from './translation.result';
import { TranslationRequest } from './translation.request';


@Injectable()
export class LocalService {
    constructor(private http: HttpClient) {
    }

    public getLanguages(): Observable<string[]> {
        return this.http.get<string[]>(`api/dictionary/languages`);
    }

    public getTranslation(request: TranslationRequest): Observable<TranslationResult> {
        return this.http.get<TranslationResult>(`api/dictionary/${request.from}/${request.to}/${request.word}`);
    }
}

