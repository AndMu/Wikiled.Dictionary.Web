import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

import { SelectorComponent } from './selector.component';
import { LocalService } from '../../service/local.service';
import 'rxjs/add/observable/of';

describe('SelectorComponent', () => {

  let component: SelectorComponent;
  let fixture: ComponentFixture<SelectorComponent>;
  let service: LocalService;
  let spy: any;

  beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [HttpClientModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule ],
          declarations: [SelectorComponent],
          schemas: [NO_ERRORS_SCHEMA],
          providers: [
            LocalService,
            {
                provide: ActivatedRoute,
                useValue: {
                   paramMap: Observable.of({ get: (key) => 'value' })
                }
              }
            ]
      });

      fixture = TestBed.createComponent(SelectorComponent);
      component = fixture.componentInstance;
      const debugElement = fixture.debugElement;
      service = debugElement.injector.get(LocalService);
  });

  afterEach(() => {
    fixture = null;
    service = null;
    component = null;
  });

  it('should create the app', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('Retrieve languages', fakeAsync(() => {
    const list: string[] = ['one', 'two'];
    const result = Observable.of(list);
    spy = spyOn(service, 'getLanguages').and.returnValue(Observable.of(list));
    fixture.detectChanges();
    tick();
  expect(component.languages.length).toBe(2);
}));
});
