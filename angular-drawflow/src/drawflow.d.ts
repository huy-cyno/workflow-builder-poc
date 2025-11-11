declare module 'drawflow' {
  export default class Drawflow {
    constructor(container: HTMLElement, render?: any, parent?: any);
    start(): void;
    clear(): void;
    export(): any;
    import(data: any): void;
    addNode(
      name: string,
      inputs: number,
      outputs: number,
      pos_x: number,
      pos_y: number,
      className: string,
      data: any,
      html: string,
      typenode?: boolean
    ): number;
    removeNodeId(id: string): boolean;
    addConnection(
      id_output: number,
      id_input: number,
      output_class: string,
      input_class: string
    ): boolean;
    getNodeFromId(id: string): any;
    on(event: string, callback: Function): void;
    zoom_in(): void;
    zoom_out(): void;
    zoom_reset(): void;
  }
}
