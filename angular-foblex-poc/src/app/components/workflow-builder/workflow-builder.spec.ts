import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowBuilder } from './workflow-builder';

describe('WorkflowBuilder', () => {
  let component: WorkflowBuilder;
  let fixture: ComponentFixture<WorkflowBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
