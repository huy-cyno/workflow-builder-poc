import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelNode } from './level-node';

describe('LevelNode', () => {
  let component: LevelNode;
  let fixture: ComponentFixture<LevelNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelNode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelNode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
