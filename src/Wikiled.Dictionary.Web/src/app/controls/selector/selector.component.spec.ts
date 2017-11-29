import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { IHash } from '../../helpers/hash';
import { SelectorComponent } from './selector.component';
import { LocalService } from '../../service/local.service';
import 'rxjs/add/observable/of';
import { By } from '@angular/platform-browser';

describe('SelectorComponent',
    () => {

        let component: SelectorComponent;
        let fixture: ComponentFixture<SelectorComponent>;
        let service: LocalService;
        let spy: any;
        const myhash: IHash = {};

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
                declarations: [SelectorComponent],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    LocalService,
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            paramMap: Observable.of({ get: (key) => myhash[key] })
                        }
                    }
                ]
            });

            myhash['from'] = 'one';
            myhash['to'] = 'two';
            myhash['word'] = 'word';
            fixture = TestBed.createComponent(SelectorComponent);
            component = fixture.componentInstance;
            const debugElement = fixture.debugElement;
            service = debugElement.injector.get(LocalService);
            component.fromLanguage = 'one';
            component.toLanguage = 'two';
            component.selectedWord = 'test';
            const list: string[] = ['one', 'two'];
            spy = spyOn(service, 'getLanguages').and.returnValue(Observable.of(list));
        });

        afterEach(() => {
            fixture = null;
            service = null;
            component = null;
        });

        it('should create the app',
            async(() => {
                const app = fixture.debugElement.componentInstance;
                expect(app).toBeTruthy();
            }));

        it('Retrieve languages',
            fakeAsync(() => {
                fixture.detectChanges();
                tick();
                expect(component.languages.length).toBe(2);
            }));

        it('Can search initial view',
            fakeAsync(() => {
                expect(component.isInvalid).toBe(true);
                fixture.detectChanges();
                tick();
                expect(component.isInvalid).toBe(false);
        }));

        it('Can not with wrong language',
        fakeAsync(() => {
            myhash['to'] = 'xxx';
            fixture.detectChanges();
            tick();
            expect(component.isInvalid).toBe(true);
        }));

        it('Change language',
        fakeAsync(() => {
            fixture.detectChanges();
            tick();
            expect(component.isInvalid).toBe(true);
            fixture.whenStable().then(() => {
                const input = fixture.debugElement.query(By.css('#to'));
                const el = input.nativeElement;

                expect(el.value).toBe('two');

                el.value = 'someValue';
                // el.dispatchEvent(new CustomEvent('valueChange', { 'detail': 'value' }));
                const event = new KeyboardEvent('keypress',
                {
                    'code': 'Enter',
                });
                fixture.nativeElement.dispatchEvent(event);

                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(component.isInvalid).toBe(false);
                });
              });
    }));
});
