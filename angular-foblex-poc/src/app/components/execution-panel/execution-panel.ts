import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExecutionService, ExecutionTrace, ExecutionStep } from '../../services/execution';
import { WorkflowNode, WorkflowEdge } from '../../services/workflow';

@Component({
  selector: 'app-execution-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './execution-panel.html',
  styleUrl: './execution-panel.css',
})
export class ExecutionPanelComponent implements OnInit, OnDestroy {
  @Input() nodes: WorkflowNode[] = [];
  @Input() edges: WorkflowEdge[] = [];
  @Input() isVisible: boolean = false;
  @Output() onClose = new EventEmitter<void>();

  executionTrace: ExecutionTrace | null = null;
  executing = false;
  stats: any = null;

  private destroy$ = new Subject<void>();

  constructor(private executionService: ExecutionService) {}

  ngOnInit(): void {
    this.executionService.executionTrace$
      .pipe(takeUntil(this.destroy$))
      .subscribe(trace => {
        this.executionTrace = trace;
        if (trace) {
          this.stats = this.executionService.getExecutionStats(trace);
        }
      });

    this.executionService.executing$
      .pipe(takeUntil(this.destroy$))
      .subscribe(executing => {
        this.executing = executing;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async startExecution(): Promise<void> {
    this.executionService.clearTrace();
    await this.executionService.executeWorkflow(this.nodes, this.edges, (step: ExecutionStep) => {
      // Step executed callback
    });
  }

  clearExecution(): void {
    this.executionService.clearTrace();
    this.stats = null;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return '#68cd86';
      case 'executing':
        return '#ffb648';
      case 'pending':
        return '#cbd5e0';
      case 'skipped':
        return '#cbd5e0';
      default:
        return '#2d3748';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return '✅';
      case 'executing':
        return '⏳';
      case 'pending':
        return '⏸️';
      case 'skipped':
        return '⊘';
      default:
        return '❓';
    }
  }

  formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
  }

  get hasNodes(): boolean {
    return this.nodes.length > 0;
  }

  get executionPath(): string {
    return this.stats?.path?.join(' → ') || 'No execution path';
  }
}
