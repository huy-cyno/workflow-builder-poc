import { Component } from '@angular/core';
import { Workflow } from './workflow/workflow';

@Component({
  selector: 'app-root',
  imports: [Workflow],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App {
  title = 'Workflow Builder - Angular + Drawflow';
}
