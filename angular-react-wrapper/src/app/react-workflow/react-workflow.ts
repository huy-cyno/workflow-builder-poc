import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-react-workflow',
  imports: [],
  templateUrl: './react-workflow.html',
  styleUrl: './react-workflow.css',
  standalone: true
})
export class ReactWorkflow implements OnInit, OnDestroy {
  @ViewChild('reactFrame', { static: false }) reactFrame!: ElementRef<HTMLIFrameElement>;

  reactAppUrl: SafeResourceUrl;
  private messageListener: any;

  constructor(private sanitizer: DomSanitizer) {
    // Construct full URL to avoid HMR issues with relative paths
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const reactPath = `${baseUrl}/react-app/index.html`;
    this.reactAppUrl = this.sanitizer.bypassSecurityTrustResourceUrl(reactPath);
  }

  ngOnInit(): void {
    // Listen for messages from React app
    this.messageListener = (event: MessageEvent) => {
      // Security: verify origin if in production
      // if (event.origin !== 'expected-origin') return;

      console.log('📨 Message from React:', event.data);

      switch (event.data.type) {
        case 'WORKFLOW_SAVED':
          this.handleWorkflowSaved(event.data.workflow);
          break;
        case 'WORKFLOW_LOADED':
          this.handleWorkflowLoaded(event.data.workflow);
          break;
        case 'NODE_SELECTED':
          this.handleNodeSelected(event.data.node);
          break;
        case 'REACT_APP_READY':
          console.log('✅ React app is ready!');
          break;
        default:
          console.log('Unknown message type:', event.data.type);
      }
    };

    window.addEventListener('message', this.messageListener);
  }

  ngOnDestroy(): void {
    if (this.messageListener) {
      window.removeEventListener('message', this.messageListener);
    }
  }

  // Methods to send messages to React app
  sendMessageToReact(message: any): void {
    if (this.reactFrame && this.reactFrame.nativeElement.contentWindow) {
      this.reactFrame.nativeElement.contentWindow.postMessage(message, '*');
      console.log('📤 Message sent to React:', message);
    }
  }

  loadWorkflow(workflow: any): void {
    this.sendMessageToReact({
      type: 'LOAD_WORKFLOW',
      workflow: workflow
    });
  }

  saveWorkflow(): void {
    this.sendMessageToReact({
      type: 'SAVE_WORKFLOW'
    });
  }

  clearWorkflow(): void {
    this.sendMessageToReact({
      type: 'CLEAR_WORKFLOW'
    });
  }

  // Handlers for React messages
  private handleWorkflowSaved(workflow: any): void {
    console.log('💾 Workflow saved in React:', workflow);
    alert('Workflow saved! Check console for data.');
    // You can save to Angular service, backend, etc.
  }

  private handleWorkflowLoaded(workflow: any): void {
    console.log('📂 Workflow loaded in React:', workflow);
  }

  private handleNodeSelected(node: any): void {
    console.log('🎯 Node selected in React:', node);
    // Update Angular UI based on selection
  }

  // Test methods for demo
  testLoadSampleWorkflow(): void {
    const sampleWorkflow = {
      nodes: [
        {
          id: 'test-1',
          type: 'level',
          position: { x: 100, y: 100 },
          data: {
            label: 'Test Node from Angular',
            levelName: 'Angular Test',
            steps: ['TEST']
          }
        }
      ],
      edges: []
    };

    this.loadWorkflow(sampleWorkflow);
  }
}
