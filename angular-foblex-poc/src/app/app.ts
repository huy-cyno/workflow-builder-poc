import { Component } from '@angular/core';
import { WorkflowBuilder } from './components/workflow-builder/workflow-builder';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WorkflowBuilder],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
