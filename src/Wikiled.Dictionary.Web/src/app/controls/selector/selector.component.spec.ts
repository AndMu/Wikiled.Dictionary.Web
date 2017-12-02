import { element } from 'protractor/built';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
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
                imports: [HttpClientModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule, DropDownsModule],
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
            async(() => {
                const userForm = fixture.componentInstance.form;
                expect(component.form.valid).toBe(false);
                fixture.detectChanges();
                expect(userForm.value).toEqual({ word: 'word', from: 'one', to: 'two' });
                expect(component.languages.length).toBe(2);
                expect(component.form.valid).toBe(true);
            }));

        it('Cannot with wrong language to',
            async(() => {
                myhash['to'] = 'xxx';
                fixture.detectChanges();
                expect(component.form.valid).toBe(false);
            }));

        it('Cannot with wrong language from',
            async(() => {
                myhash['from'] = '';
                fixture.detectChanges();
                expect(component.form.valid).toBe(false);
            }));

        it('Cannot with empty word',
            async(() => {
                myhash['word'] = '';
                fixture.detectChanges();
                expect(component.form.valid).toBe(false);
            }));

        it('Set Empty Word',
            fakeAsync(() => {
                const form = fixture.componentInstance.form;
                fixture.detectChanges();
                expect(component.form.valid).toBe(true);
                form.controls['word'].setValue('');
                expect(component.form.valid).toBe(false);
            }));
    });
