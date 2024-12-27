import { AfterContentInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, SimpleChanges, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

import type Canvas from 'diagram-js/lib/core/Canvas';
import type { ImportDoneEvent, ImportXMLResult } from 'bpmn-js/lib/BaseViewer';

/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */
import BpmnJS from 'bpmn-js/lib/Modeler';
import { from, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrl: './diagram.component.scss'
})

export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy, OnInit {

  @ViewChild('ref', { static: true }) private el: ElementRef | undefined;
  @Input() url?: string;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();

  private bpmnJS: BpmnJS = new BpmnJS();

  constructor(private http: HttpClient) {
    this.bpmnJS.on<ImportDoneEvent>('import.done', ({ error }) => {
      if (!error) {
        this.bpmnJS.get<Canvas>('canvas').zoom('fit-viewport');
      }
    });
  }

  ngAfterContentInit(): void {
    if (this.el) {
      this.bpmnJS.attachTo(this.el.nativeElement);
    }
  }

  ngOnInit(): void {
    if (this.url) {
      this.loadUrl(this.url);
    }
  }

  ngOnChanges(changes: any) {
    // re-import whenever the url changes
    if (changes.url) {
      this.loadUrl(changes.url.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  loadUrl(url: string): Subscription {

    return (
      this.http.get(url, { responseType: 'text' }).pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map(result => result.warnings),
      ).subscribe(
        (warnings) => {
          this.importDone.emit({
            type: 'success',
            warnings
          });
        },
        (err) => {
          this.importDone.emit({
            type: 'error',
            error: err
          });
        }
      )
    );
  }

  private importDiagram(xml: string): Observable<ImportXMLResult> {
    return from(this.bpmnJS.importXML(xml));
  }

  exportDiagram(): void {

    console.log("export")

    this.bpmnJS.saveXML({ format: true }).then(
      (result) => {
        const xml = result?.xml;
        if (xml) {
          this.downloadFile('diagram.bpmn', xml, 'application/xml');
        } else {
          console.error('No se pudo generar el XML del diagrama.');
        }
      },
      (err) => {
        console.error('Error al exportar el diagrama como XML:', err);
      }
    );
  }

  downloadFile(filename: string, data: string | Blob, type: string): void {
    const blob = typeof data === 'string' ? new Blob([data], { type }) : data; // Crear un Blob si es string
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

}