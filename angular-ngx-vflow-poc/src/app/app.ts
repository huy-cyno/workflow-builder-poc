import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowBuilder } from './components/workflow-builder';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, WorkflowBuilder],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
