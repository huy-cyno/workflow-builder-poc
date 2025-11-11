# Foblex Flow Implementation Guide

## Overview
Foblex Flow is an Angular library for creating dynamic, interactive flows with node-based visual programming. It provides:
- Drag-and-drop nodes and connections
- Event-driven architecture
- Customizable templates
- Zoom and pan support
- Selection management

## File Paths in node_modules

All Foblex Flow types are located in:
- `/Users/huyvuong/Documents/GitHub/workflow-builder-poc/angular-foblex-poc/node_modules/@foblex/flow/`

## 1. Setting Up Foblex Flow

### Import the Module
```typescript
import { FFlowModule } from '@foblex/flow';

@Component({
  imports: [FFlowModule]
})
export class WorkflowBuilder {}
```

## 2. Core Directives & Components

### f-flow Component
Main container for the flow canvas.

**Location:** `@foblex/flow/f-flow/f-flow.component.d.ts`

**Properties:**
- `fId: string` - Unique identifier for the flow
- `fLoaded: EventEmitter<string>` - Emits when flow is loaded

**Methods:**
- `getNodesBoundingBox(): IRect | null` - Get bounding box of all nodes
- `getSelection(): ICurrentSelection` - Get currently selected elements
- `getPositionInFlow(position: IPoint): IRect` - Convert screen position to flow position
- `getState(): IFFlowState` - Get complete flow state
- `select(nodes: string[], connections: string[], isSelectedChanged?: boolean): void` - Select elements
- `selectAll(): void` - Select all nodes and connections
- `clearSelection(): void` - Clear selection

**Usage:**
```html
<f-flow [fFlowId]="'workflow-flow'" (fLoaded)="onFlowLoaded($event)">
  <f-canvas>
    <!-- Nodes and connections go here -->
  </f-canvas>
</f-flow>
```

### f-canvas Component
Renders nodes, connections, and groups. Handles zooming and panning.

**Location:** `@foblex/flow/f-canvas/f-canvas.component.d.ts`

**Inputs (Signals):**
- `position: IPoint` - Canvas position
- `scale: number` - Zoom scale (default 1)
- `debounceTime: number` - Debounce time for updates (default 100ms)

**Events:**
- `fCanvasChange: EventEmitter<FCanvasChangeEvent>` - Canvas position/scale changed

**Methods:**
- `redraw(): void` - Redraw canvas immediately
- `redrawWithAnimation(): void` - Redraw with CSS animation
- `centerGroupOrNode(groupOrNodeId: string, animated?: boolean): void` - Center element
- `fitToScreen(padding?: IPoint, animated?: boolean): void` - Fit all content to screen
- `resetScaleAndCenter(animated?: boolean): void` - Reset zoom and center
- `getScale(): number` - Get current zoom scale
- `setScale(scale: number, toPosition?: IPoint): void` - Set zoom level
- `resetScale(): void` - Reset zoom to default

**Usage:**
```html
<f-canvas [position]="canvasPosition" [scale]="canvasScale" (fCanvasChange)="onCanvasChange($event)">
  <!-- Nodes and connections -->
</f-canvas>
```

### f-node Directive
Creates a draggable node element.

**Location:** `@foblex/flow/f-node/f-node.directive.d.ts`

**Input Signals:**
- `fNodeId: string` - Unique node ID
- `fNodeParentId: string | null` - Parent group ID (for nested nodes)
- `fNodePosition: IPoint` - Node position {x, y}
- `fNodeSize: ISize` - Node dimensions (optional)
- `fNodeRotate: number` - Rotation in degrees
- `fConnectOnNode: boolean` - Allow connections anywhere on node
- `fNodeDraggingDisabled: boolean` - Disable node dragging
- `fNodeSelectionDisabled: boolean` - Disable node selection
- `fIncludePadding: boolean` - Include padding in size calculations
- `fAutoExpandOnChildHit: boolean` - Auto-expand groups when children are hit
- `fAutoSizeToFitChildren: boolean` - Auto-size groups to fit children

**Events:**
- `fNodePositionChange: EventEmitter<IPoint>` - Position changed
- `fNodeSizeChange: EventEmitter<IRect>` - Size changed
- `fNodeRotateChange: EventEmitter<number>` - Rotation changed

**Usage:**
```html
<f-node
  [fNodeId]="node.id"
  [fNodePosition]="node.position"
  [fNodeSize]="node.size"
  (fNodePositionChange)="onPositionChange($event)"
>
  <!-- Node content -->
</f-node>
```

### f-connection Component
Creates a connection (edge) between nodes.

**Location:** `@foblex/flow/f-connection/f-connection/f-connection.component.d.ts`

**Input Signals:**
- `fConnectionId: string` - Unique connection ID
- `fOutputId: string` - Output connector ID
- `fInputId: string` - Input connector ID
- `fRadius: number` - Connection curve radius
- `fOffset: number` - Connection offset
- `fType: EFConnectionType` - Connection type (straight, curve, adaptive, etc.)
- `fBehavior: EFConnectionBehavior` - Connection behavior
- `fInputSide: EFConnectionConnectableSide` - Where input connects (left, right, top, bottom)
- `fOutputSide: EFConnectionConnectableSide` - Where output connects

**Usage:**
```html
<f-connection
  [fConnectionId]="edge.id"
  [fOutputId]="edge.from"
  [fInputId]="edge.to"
  fType="straight"
></f-connection>
```

### f-node-input Directive
Input connector on a node.

**Location:** `@foblex/flow/f-connectors/f-node-input/f-node-input.directive.d.ts`

**Input Signals:**
- `fInputId: string` - Unique input connector ID
- `fInputCategory: string` - Category for type-safe connections
- `fInputMultiple: boolean` - Allow multiple connections
- `fInputDisabled: boolean` - Disable this input
- `fInputConnectableSide: EFConnectableSide` - Where to connect (left, right, top, bottom)

**Usage:**
```html
<div fNode [fNodeId]="'node-1'">
  <div fNodeInput [fInputId]="'input-1'" fInputConnectableSide="left"></div>
</div>
```

### f-node-output Directive
Output connector on a node.

**Location:** `@foblex/flow/f-connectors/f-node-output/f-node-output.directive.d.ts`

**Input Signals:**
- `fOutputId: string` - Unique output connector ID
- `fOutputMultiple: boolean` - Allow multiple connections
- `fOutputDisabled: boolean` - Disable this output
- `fOutputConnectableSide: EFConnectableSide` - Where to connect
- `isSelfConnectable: boolean` - Allow self-connections
- `fCanBeConnectedInputs: string[]` - Whitelist of input IDs to connect to

**Usage:**
```html
<div fNode [fNodeId]="'node-1'">
  <div fNodeOutput [fOutputId]="'output-1'" fOutputConnectableSide="right"></div>
</div>
```

## 3. Draggable Directive (Event Handling)

### f-draggable Directive
Main directive for handling drag-and-drop interactions.

**Location:** `@foblex/flow/f-draggable/f-draggable.directive.d.ts`

**Usage:**
```html
<f-flow fDraggable>
  <f-canvas>
    <!-- Content -->
  </f-canvas>
</f-flow>
```

**Input Properties:**
- `fDraggableDisabled: boolean` - Disable dragging
- `fMultiSelectTrigger: FEventTrigger` - Trigger for multi-select (e.g., 'ctrl' or 'shift')
- `fReassignConnectionTrigger: FEventTrigger` - Trigger to reassign connections
- `fCreateConnectionTrigger: FEventTrigger` - Trigger to create connections
- `fNodeResizeTrigger: FEventTrigger` - Trigger to resize nodes
- `fNodeRotateTrigger: FEventTrigger` - Trigger to rotate nodes
- `fNodeMoveTrigger: FEventTrigger` - Trigger to move nodes
- `fCanvasMoveTrigger: FEventTrigger` - Trigger to pan canvas
- `fExternalItemTrigger: FEventTrigger` - Trigger for external items
- `fEmitOnNodeIntersect: boolean` - Emit event when nodes intersect
- `vCellSize: number` - Vertical grid cell size (for snapping)
- `hCellSize: number` - Horizontal grid cell size (for snapping)
- `fCellSizeWhileDragging: boolean` - Enable grid snapping while dragging

**Events:**
- `fSelectionChange: EventEmitter<FSelectionChangeEvent>` - Selection changed
- `fMoveNodes: EventEmitter<FMoveNodesEvent>` - Nodes moved
- `fCreateConnection: EventEmitter<FCreateConnectionEvent>` - Connection created
- `fReassignConnection: EventEmitter<FReassignConnectionEvent>` - Connection reassigned
- `fDragStarted: EventEmitter<FDragStartedEvent>` - Drag started
- `fDragEnded: EventEmitter<void>` - Drag ended
- `fDropToGroup: EventEmitter<FDropToGroupEvent>` - Dropped to group
- `fNodeIntersectedWithConnections: EventEmitter<FNodeIntersectedWithConnections>` - Node intersected

### f-drag-handle Directive
Specifies which part of a node can be used to drag it.

**Location:** `@foblex/flow/f-node/f-drag-handle.directive.d.ts`

**Usage:**
```html
<div fNode [fNodeId]="'node-1'">
  <div fDragHandle class="node-header">
    <!-- Only this part can be dragged -->
    <span>{{ node.label }}</span>
  </div>
  <div class="node-content"><!-- Cannot drag from here --></div>
</div>
```

## 4. Event Types

### FSelectionChangeEvent
Emitted when selection changes.

**Location:** `@foblex/flow/f-draggable/f-selection-change-event.d.ts`

**Properties:**
- `fNodeIds: string[]` - Selected node IDs
- `fGroupIds: string[]` - Selected group IDs
- `fConnectionIds: string[]` - Selected connection IDs

**Usage:**
```typescript
onSelectionChange(event: FSelectionChangeEvent): void {
  console.log('Selected nodes:', event.fNodeIds);
  console.log('Selected connections:', event.fConnectionIds);
}
```

### FMoveNodesEvent
Emitted when nodes are moved.

**Location:** `@foblex/flow/f-draggable/f-node-move/f-move-nodes.event.d.ts`

**Properties:**
- `fNodes: Array<{id: string, position: IPoint}>` - Moved nodes with new positions

**Usage:**
```typescript
onMoveNodes(event: FMoveNodesEvent): void {
  event.fNodes.forEach(node => {
    console.log(`Node ${node.id} moved to`, node.position);
  });
}
```

### FCreateConnectionEvent
Emitted when a connection is created.

**Location:** `@foblex/flow/f-draggable/f-connection/f-create-connection/f-create-connection.event.d.ts`

**Properties:**
- `fOutputId: string` - Output connector ID
- `fInputId: string | undefined` - Input connector ID (undefined if not connected)
- `fDropPosition: IPoint` - Position where connection was dropped

**Usage:**
```typescript
onCreateConnection(event: FCreateConnectionEvent): void {
  console.log(`Connection from ${event.fOutputId} to ${event.fInputId}`);
  if (!event.fInputId) {
    console.log('Connection not connected, dropped at', event.fDropPosition);
  }
}
```

### FDragStartedEvent
Emitted when drag operation starts.

**Location:** `@foblex/flow/f-draggable/domain/f-drag-started-event.d.ts`

**Properties:**
- `fEventType: string` - Type of drag event
- `fData?: any` - Additional data

## 5. Complete Example

### TypeScript Component
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FFlowModule } from '@foblex/flow';
import {
  FSelectionChangeEvent,
  FMoveNodesEvent,
  FCreateConnectionEvent,
  IPoint
} from '@foblex/flow';

interface Node {
  id: string;
  position: IPoint;
  label: string;
  inputs: string[];
  outputs: string[];
}

interface Edge {
  id: string;
  from: string;
  to: string;
}

@Component({
  selector: 'app-workflow',
  standalone: true,
  imports: [CommonModule, FFlowModule],
  template: `
    <div class="workflow-container">
      <f-flow fDraggable
        (fSelectionChange)="onSelectionChange($event)"
        (fMoveNodes)="onMoveNodes($event)"
        (fCreateConnection)="onCreateConnection($event)"
        (fDragStarted)="onDragStarted($event)"
        (fDragEnded)="onDragEnded()"
      >
        <f-canvas [position]="canvasPosition" [scale]="canvasScale">
          <!-- Render all nodes -->
          <ng-container *ngFor="let node of nodes">
            <f-node
              [fNodeId]="node.id"
              [fNodePosition]="node.position"
            >
              <!-- Node content -->
              <div class="node-content">
                <div fDragHandle class="node-header">{{ node.label }}</div>

                <!-- Input connectors -->
                <div *ngFor="let input of node.inputs" 
                  fNodeInput [fInputId]="input"
                  fInputConnectableSide="left"
                ></div>

                <!-- Output connectors -->
                <div *ngFor="let output of node.outputs"
                  fNodeOutput [fOutputId]="output"
                  fOutputConnectableSide="right"
                ></div>
              </div>
            </f-node>
          </ng-container>

          <!-- Render all connections -->
          <ng-container *ngFor="let edge of edges">
            <f-connection
              [fConnectionId]="edge.id"
              [fOutputId]="edge.from"
              [fInputId]="edge.to"
              fType="smoothstep"
            ></f-connection>
          </ng-container>
        </f-canvas>
      </f-flow>
    </div>
  `
})
export class WorkflowComponent implements OnInit {
  nodes: Node[] = [];
  edges: Edge[] = [];
  canvasPosition: IPoint = { x: 0, y: 0 };
  canvasScale: number = 1;

  ngOnInit(): void {
    this.initializeWorkflow();
  }

  private initializeWorkflow(): void {
    // Create sample nodes
    this.nodes = [
      {
        id: 'node-1',
        position: { x: 100, y: 100 },
        label: 'Start',
        inputs: [],
        outputs: ['output-1']
      },
      {
        id: 'node-2',
        position: { x: 300, y: 100 },
        label: 'Process',
        inputs: ['input-1'],
        outputs: ['output-1']
      }
    ];

    this.edges = [];
  }

  onSelectionChange(event: FSelectionChangeEvent): void {
    console.log('Selection changed:', {
      nodes: event.fNodeIds,
      connections: event.fConnectionIds
    });
  }

  onMoveNodes(event: FMoveNodesEvent): void {
    // Update node positions
    event.fNodes.forEach(moved => {
      const node = this.nodes.find(n => n.id === moved.id);
      if (node) {
        node.position = moved.position;
      }
    });
  }

  onCreateConnection(event: FCreateConnectionEvent): void {
    if (event.fInputId) {
      const edgeId = `edge-${Date.now()}`;
      this.edges.push({
        id: edgeId,
        from: event.fOutputId,
        to: event.fInputId
      });
    }
  }

  onDragStarted(event: any): void {
    console.log('Drag started:', event.fEventType);
  }

  onDragEnded(): void {
    console.log('Drag ended');
  }

  // Dynamic node/edge management
  addNode(id: string, label: string, position: IPoint): void {
    this.nodes.push({
      id,
      position,
      label,
      inputs: ['input-1'],
      outputs: ['output-1']
    });
  }

  deleteNode(nodeId: string): void {
    this.nodes = this.nodes.filter(n => n.id !== nodeId);
    this.edges = this.edges.filter(e => e.from !== nodeId && e.to !== nodeId);
  }

  deleteEdge(edgeId: string): void {
    this.edges = this.edges.filter(e => e.id !== edgeId);
  }
}
```

### HTML Template
```html
<div class="workflow-container">
  <f-flow fDraggable 
    (fSelectionChange)="onSelectionChange($event)"
    (fMoveNodes)="onMoveNodes($event)"
    (fCreateConnection)="onCreateConnection($event)"
  >
    <f-canvas [position]="canvasPosition" [scale]="canvasScale">
      <!-- Nodes -->
      <ng-container *ngFor="let node of nodes">
        <f-node
          [fNodeId]="node.id"
          [fNodePosition]="node.position"
          class="node"
        >
          <div fDragHandle class="node-header">{{ node.label }}</div>
          <div class="node-body">
            <!-- Input connectors -->
            <div *ngFor="let input of node.inputs"
              fNodeInput [fInputId]="input"
              fInputConnectableSide="left"
              class="connector input"
            ></div>

            <!-- Output connectors -->
            <div *ngFor="let output of node.outputs"
              fNodeOutput [fOutputId]="output"
              fOutputConnectableSide="right"
              class="connector output"
            ></div>
          </div>
        </f-node>
      </ng-container>

      <!-- Connections -->
      <ng-container *ngFor="let edge of edges">
        <f-connection
          [fConnectionId]="edge.id"
          [fOutputId]="edge.from"
          [fInputId]="edge.to"
          fType="smoothstep"
        ></f-connection>
      </ng-container>
    </f-canvas>
  </f-flow>
</div>
```

## 6. Key Type Definitions

**IPoint:**
```typescript
interface IPoint {
  x: number;
  y: number;
}
```

**IRect:**
```typescript
interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

**ISize:**
```typescript
interface ISize {
  width: number;
  height: number;
}
```

**EFConnectionType:** `'straight' | 'curve' | 'adaptive' | 'segment' | 'bezier'`

**EFConnectableSide:** `'left' | 'right' | 'top' | 'bottom'`

**EFConnectionBehavior:** `'fixed-center' | 'floating' | 'fixed-outbound'`

## 7. Important Files Reference

| Feature | File Path |
|---------|-----------|
| FFlowModule | `@foblex/flow/f-flow.module.d.ts` |
| FFlowComponent | `@foblex/flow/f-flow/f-flow.component.d.ts` |
| FCanvasComponent | `@foblex/flow/f-canvas/f-canvas.component.d.ts` |
| FNodeDirective | `@foblex/flow/f-node/f-node.directive.d.ts` |
| FConnectionComponent | `@foblex/flow/f-connection/f-connection/f-connection.component.d.ts` |
| FNodeInputDirective | `@foblex/flow/f-connectors/f-node-input/f-node-input.directive.d.ts` |
| FNodeOutputDirective | `@foblex/flow/f-connectors/f-node-output/f-node-output.directive.d.ts` |
| FDraggableDirective | `@foblex/flow/f-draggable/f-draggable.directive.d.ts` |
| FSelectionChangeEvent | `@foblex/flow/f-draggable/f-selection-change-event.d.ts` |
| FMoveNodesEvent | `@foblex/flow/f-draggable/f-node-move/f-move-nodes.event.d.ts` |
| FCreateConnectionEvent | `@foblex/flow/f-draggable/f-connection/f-create-connection/f-create-connection.event.d.ts` |

## 8. Best Practices

1. **Always use fDragHandle** on the part of the node that should be draggable
2. **Use fNodeMultiple and fInputMultiple** for complex connections
3. **Listen to fMoveNodes** to update your data model with new positions
4. **Manage node lifecycle** by adding/removing from arrays to trigger Angular change detection
5. **Use IPoint and IRect** consistently for positioning
6. **Set fConnectOnNode="false"** to require connections only on connectors
7. **Use fCellSizeWhileDragging** for grid-snapping behavior

## Resources

- Official Documentation: https://flow.foblex.com/docs/get-started
- Examples: https://github.com/Foblex/f-flow-example
- Scheme Editor Example: https://github.com/Foblex/f-scheme-editor
