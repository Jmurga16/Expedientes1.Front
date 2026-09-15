import { AfterContentInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { from, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';
import type Canvas from 'diagram-js/lib/core/Canvas';
import type ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import type EventBus from 'diagram-js/lib/core/EventBus';
import type { ImportDoneEvent, ImportXMLError, ImportXMLResult } from 'bpmn-js/lib/BaseViewer';
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling';
import type { Shape } from 'bpmn-js/lib/model/Types';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import BpmnJS from 'bpmn-js/lib/Modeler';
import { FileService } from '../../services/file.service';
import { NotificationService } from '../../services/notification.service';
import { IArea } from '../../../modules/area/common/models/area.interface';
import { AreaService } from '../../../modules/area/common/services/area.service';
import { FormWorkflowService } from '../../../modules/workflow/common/services/form-workflow.service';
import { IBpmnProcess } from '../../models/bpmn.interface';

const PAUSA_ENTRE_CAMBIOS = 200;
const ESCALA_IMAGEN = 2;
const ERROR_IMAGEN = 'No se pudo generar la imagen del diagrama.';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrl: './diagram.component.scss'
})
export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy, OnInit {

  @ViewChild('ref', { static: true }) private el: ElementRef | undefined;
  @Input() url?: string;
  @Input() idDemanda?: number;
  @Input() readonly: boolean = false;
  @Output() private importDone: EventEmitter<ImportDoneEvent> = new EventEmitter();
  @Output() fileBPMN = new EventEmitter<File>();
  @Output() pasos = new EventEmitter<string[]>();

  listArea: IArea[] = [];

  idArea = new FormControl<number | null>(null)

  private bpmnJS: BpmnJS = new BpmnJS();
  private loadSubscription?: Subscription;
  private nombreSubscription?: Subscription;
  private cambiosSubscription?: Subscription;
  private readonly cambios = new Subject<void>();
  private readonly onCommandStackChanged = () => this.cambios.next();

  constructor(
    private http: HttpClient,
    private fileService: FileService,
    private areaService: AreaService,
    private formWorkflowService: FormWorkflowService,
    private notification: NotificationService,
  ) {
    this.bpmnJS.on<ImportDoneEvent>('import.done', ({ error }) => {
      if (!error) {
        this.bpmnJS.get<Canvas>('canvas').zoom('fit-viewport');
      }
    });

    this.bpmnJS.get<EventBus>('eventBus').on('commandStack.changed', this.onCommandStackChanged);
  }

  ngAfterContentInit(): void {
    if (this.el) {
      this.bpmnJS.attachTo(this.el.nativeElement);
    }
  }

  ngOnInit(): void {
    this.getAreas()

    this.cambiosSubscription = this.cambios.pipe(debounceTime(PAUSA_ENTRE_CAMBIOS))
      .subscribe(() => this.updateDiagramFile());

    this.nombreSubscription = this.formWorkflowService.nombre$.subscribe(value => {
      this.updateWorkflowName(value)
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['url'] && this.url) {
      this.loadUrl(this.url);
    }
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.nombreSubscription?.unsubscribe();
    this.cambiosSubscription?.unsubscribe();

    this.bpmnJS.get<EventBus>('eventBus').off('commandStack.changed', this.onCommandStackChanged);

    this.bpmnJS.destroy();
  }

  loadUrl(url: string): void {
    this.loadSubscription?.unsubscribe();
    this.loadSubscription = this.fileService.resolveUrl(url).pipe(
      switchMap((signedUrl: string) => this.http.get(signedUrl, { responseType: 'text' })),
      switchMap((xml: string) => this.importDiagram(xml)),
      map(result => result.warnings),
    ).subscribe({
      next: (warnings) => this.importDone.emit({ warnings }),
      error: (err: ImportXMLError) => this.importDone.emit({ warnings: err.warnings ?? [], error: err })
    });
  }

  private importDiagram(xml: string): Observable<ImportXMLResult> {
    return from(this.bpmnJS.importXML(xml)).pipe(
      tap(() => {
        this.updateWorkflowName(this.formWorkflowService.nombreActual);

        if (this.idDemanda) {
          this.pasos.emit(this.getPasos());
        }
      })
    );
  }

  exportDiagram(): void {
    this.bpmnJS.saveXML({ format: true }).then(
      (result) => {
        const xml = result?.xml;
        if (xml) {
          this.fileService.downloadFile('diagram.bpmn', xml, 'application/xml');
        } else {
          this.notification.error('No se pudo generar el XML del diagrama.');
        }
      },
      () => {
        this.notification.error('No se pudo descargar el diagrama.');
      }
    );
  }

  exportImagen(): void {
    this.bpmnJS.saveSVG().then(
      (result) => this.descargarPng(result.svg),
      () => this.notification.error(ERROR_IMAGEN)
    );
  }

  private descargarPng(svg: string): void {
    const imagen = new Image();

    imagen.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = imagen.naturalWidth * ESCALA_IMAGEN;
      canvas.height = imagen.naturalHeight * ESCALA_IMAGEN;

      const contexto = canvas.getContext('2d');
      if (!contexto) {
        this.notification.error(ERROR_IMAGEN);
        return;
      }

      contexto.fillStyle = '#ffffff';
      contexto.fillRect(0, 0, canvas.width, canvas.height);
      contexto.drawImage(imagen, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(blob => {
        if (!blob) {
          this.notification.error(ERROR_IMAGEN);
          return;
        }
        this.fileService.downloadFile('diagrama.png', blob, 'image/png');
      }, 'image/png');
    };

    imagen.onerror = () => this.notification.error(ERROR_IMAGEN);
    imagen.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
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

  getAreas() {
    this.areaService.getActives().subscribe({
      next: (response: IArea[]) => {
        this.listArea = response;
      }
    });
  }

  updateWorkflowName(newName: string): void {
    if (!newName) {
      return;
    }

    const participant = this.getShapes('bpmn:Participant')[0];

    if (!participant || participant.businessObject.name === newName) {
      return;
    }

    this.getModeling().updateProperties(participant, { name: newName });
  }

  addAreaToWorkflow() {
    const idArea = this.idArea.value;
    if (idArea == null) {
      this.notification.warning('Debe seleccionar un área.');
      return;
    }

    const area = this.listArea.find(item => item.id === idArea);
    if (!area)
      return;

    if (!this.addLaneToWorkflow(`Lane_${area.id}`, area.nombre))
      return;

    this.listArea = this.listArea.filter(item => item.id !== idArea);

    this.idArea.setValue(null);
  }

  private addLaneToWorkflow(laneId: string, laneName: string): boolean {
    const target = this.getLastLane() ?? this.getShapes('bpmn:Participant')[0];

    if (!target) {
      this.notification.error('El diagrama todavía no está cargado.');
      return false;
    }

    if (this.getElementRegistry().get(laneId)) {
      this.notification.warning(`El área "${laneName}" ya está en el diagrama.`);
      return false;
    }

    const modeling = this.getModeling();
    const lane = modeling.addLane(target, 'bottom');
    modeling.updateProperties(lane, { id: laneId, name: laneName });

    return true;
  }

  private getLastLane(): Shape | undefined {
    return this.getShapes('bpmn:Lane')
      .sort((a, b) => a.y - b.y)
      .pop();
  }

  private getShapes(type: string): Shape[] {
    return this.getElementRegistry().filter(element => is(element, type)) as Shape[];
  }

  private getElementRegistry(): ElementRegistry {
    return this.bpmnJS.get<ElementRegistry>('elementRegistry');
  }

  private getModeling(): Modeling {
    return this.bpmnJS.get<Modeling>('modeling');
  }

  private getPasos(): string[] {
    const definitions = this.bpmnJS.getDefinitions();
    const rootElements: IBpmnProcess[] = definitions?.rootElements ?? [];
    const processes = rootElements.filter(el => el.$type === 'bpmn:Process');

    if (processes.length === 0) {
      this.notification.warning('El diagrama no tiene pasos definidos.');
      return [];
    }

    return processes
      .flatMap(process => process.flowElements ?? [])
      .filter(element => element.$type === 'bpmn:Task')
      .map(task => task.name);
  }
}
