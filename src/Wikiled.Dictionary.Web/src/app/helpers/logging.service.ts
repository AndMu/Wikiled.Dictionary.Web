import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class LoggingService {

    public log(message: string) {
        if (!environment.production) {
            console.log(message);
        }
    }
}
