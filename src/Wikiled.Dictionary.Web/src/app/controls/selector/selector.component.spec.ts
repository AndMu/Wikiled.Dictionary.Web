import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { SelectorComponent } from './selector.component';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          SelectorComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
      const fixture = TestBed.createComponent(SelectorComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));  

//   it('Retrieve languages', fakeAsync(() => {
//     let value;
//     service.getLanguages().subscribe((data: string[]) => {
//         value = data;
//     });

//     tick();
//     expect(value.length).toBe(50);
// }));
});
