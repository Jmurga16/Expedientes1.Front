import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-bpmn',
  templateUrl: './bpmn.component.html',
  styleUrl: './bpmn.component.scss'
})
export class BpmnComponent {

  @Input() urlBPMN!: string;
  @Input() idDemanda: any
  @Output() fileChange = new EventEmitter<File>()
  @Output() pasos = new EventEmitter<string[]>()

  importError?: Error;

  handleImported(event: any) {
    const { type, error } = event;

    if (type === 'error') {
      console.error('Failed to render diagram', error);
    }

    this.importError = error;
  }

  onChangeDiagram(file: File): void {
    this.fileChange.emit(file);
  }

  listPasos(pasos: string[]) {
    this.pasos.emit(pasos);
  }
}
