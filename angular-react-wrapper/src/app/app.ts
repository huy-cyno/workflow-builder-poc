import { Component } from '@angular/core';
import { ReactWorkflow } from './react-workflow/react-workflow';

@Component({
  selector: 'app-root',
  imports: [ReactWorkflow],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true
})
export class App {
  title = 'Angular Wrapper for React Workflow Builder';
}
