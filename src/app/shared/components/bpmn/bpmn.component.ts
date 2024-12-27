import { Component } from '@angular/core';

@Component({
  selector: 'app-bpmn',
  templateUrl: './bpmn.component.html',
  styleUrl: './bpmn.component.scss'
})
export class BpmnComponent {
  title = 'bpmn-js-angular';
  diagramUrl = 'assets/demo/base.bpmn';
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

}
