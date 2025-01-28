import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-bpmn',
  templateUrl: './bpmn.component.html',
  styleUrl: './bpmn.component.scss'
})
export class BpmnComponent {

  title = 'bpmn-js-angular';
  @Input() urlBPMN!: string;
  @Input() idDemanda: any
  @Output() urlChange = new EventEmitter<string>()
  @Output() fileChange = new EventEmitter<File>()
  @Output() pasos = new EventEmitter<any>()

  importError?: Error;

  handleImported(event: any) {

    const { type, error, warnings } = event;

    if (type === 'success') {
      console.log(`Rendered diagram (%s warnings)`, warnings.length);
    }

    if (type === 'error') {
      console.error('Failed to render diagram', error);
    }

    this.importError = error;
  }

  onUrlUpdated(newUrl: string): void {
    this.urlBPMN = newUrl;
    this.urlChange.emit(this.urlBPMN);
  }

  onChangeDiagram(file: File): void {
    this.fileChange.emit(file);
  }

  listPasos(event: any){
    /* console.log("bpmn.component")
    console.log("listPasos")
    console.log(event) */
    this.pasos.emit(event);
  }

}
