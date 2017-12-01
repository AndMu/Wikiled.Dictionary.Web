import { element } from 'protractor/built';
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
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
        const myhash = new Map<string, string>();

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
                expect(component.form.valid).toBe(false);
                fixture.detectChanges();
                tick();
                expect(component.languages.length).toBe(2);
                expect(component.form.valid).toBe(true);
            }));

        it('Can not with wrong language',
        fakeAsync(() => {
            //myhash['to'] = 'xxx';
            //fixture.detectChanges();
            //tick();
            //expect(component.isInvalid).toBe(true);
        }));

        it('Change language',
        fakeAsync(() => {
            //fixture.detectChanges();
            //tick();
            //expect(component.isInvalid).toBe(false);
            //fixture.whenStable().then(() => {
            //    const input = fixture.debugElement.query(By.css('#to'));
            //    const intputElement = input.nativeElement;

            //    expect(intputElement.value).toBe('two');
            //    intputElement.value = 'x';
            //    intputElement.dispatchEvent(new Event('input'));
            //    tick();
            //    fixture.detectChanges();
            //    // input.triggerEventHandler('valueChange', 'x');
            //    fixture.whenStable().then(() => {
            //        expect(component.isInvalid).toBe(true);
            //    });
            //  });
    }));
});
