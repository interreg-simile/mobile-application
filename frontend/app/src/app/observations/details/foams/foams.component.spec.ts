import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoamsComponent } from './foams.component';

describe('FoamsComponent', () => {
  let component: FoamsComponent;
  let fixture: ComponentFixture<FoamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoamsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
