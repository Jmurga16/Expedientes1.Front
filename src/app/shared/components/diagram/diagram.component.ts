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
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrl: './diagram.component.scss'
})

export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy, OnInit {

  @ViewChild('ref', { static: true }) private el: ElementRef | undefined;
  @Input() url?: string;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();
  @Output() urlUpdated = new EventEmitter<string>();
  @Output() fileBPMN = new EventEmitter<File>();


  private bpmnJS: BpmnJS = new BpmnJS();

  constructor(
    private http: HttpClient,
    private fileService: FileService
  ) {
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

    const eventBus = this.bpmnJS.get('eventBus') as any; // Aserción de tipo
    eventBus.on('commandStack.changed', () => {
      console.log('Cambio detectado en el diagrama');
      this.updateDiagramFile();
    });

    return from(this.bpmnJS.importXML(xml));
  }

  exportDiagram(): void {
    this.bpmnJS.saveXML({ format: true }).then(
      (result) => {
        const xml = result?.xml;
        if (xml) {
          this.fileService.downloadFile('diagram.bpmn', xml, 'application/xml');
        } else {
          console.error('No se pudo generar el XML del diagrama.');
        }
      },
      (err) => {
        console.error('Error al exportar el diagrama como XML:', err);
      }
    );
  }

  uploadDiagram() {
    this.bpmnJS.saveXML({ format: true }).then(
      (result) => {
        const xml = result?.xml;
        if (xml) {
          this.onUpload(xml);
        } else {
          console.error('No se pudo generar el XML del diagrama.');
        }
      },
      (err) => {
        console.error('Error al exportar el diagrama como XML:', err);
      }
    );
  }

  onUpload(xml: string) {
    const file = new File([xml], 'diagram.bpmn', { type: 'application/xml' });
    const container = "workflow-bpmn"

    if (file) {
      this.fileService.uploadFileUnique(file, container).subscribe({
        next: (response: any) => {
          console.log('Archivo subido:', response);
          this.updateUrl(response.fileUrl)
        },
        error: (err) => console.error('Error al subir archivo:', err),
      });
    }
  }

  updateUrl(newUrl: string): void {
    this.url = newUrl;
    this.urlUpdated.emit(this.url);
  }

  updateDiagramFile() {
    this.bpmnJS.saveXML({ format: true }).then(
      (result) => {
        const xml = result?.xml;
        if (xml) {          
          const file = new File([xml], 'diagram.bpmn', { type: 'application/xml' });
          this.fileBPMN.emit(file);          
        }
      }
    );
  }

}