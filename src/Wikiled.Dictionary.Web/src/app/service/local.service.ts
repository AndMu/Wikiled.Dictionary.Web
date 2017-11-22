import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LocalService {
  constructor(private http: HttpClient) {
  }

  public getLanguages(): Observable<string[]> {
      return this.http.get<string[]>(`api/dictionary/languages`);
  }
}
