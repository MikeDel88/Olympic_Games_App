import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInfosComponent } from './header-infos.component';

describe('HeaderInfosComponent', () => {
  let component: HeaderInfosComponent;
  let fixture: ComponentFixture<HeaderInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderInfosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
