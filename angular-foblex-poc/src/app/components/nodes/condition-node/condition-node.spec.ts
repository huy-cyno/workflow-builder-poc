import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionNode } from './condition-node';

describe('ConditionNode', () => {
  let component: ConditionNode;
  let fixture: ComponentFixture<ConditionNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConditionNode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConditionNode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
