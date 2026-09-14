import { AfterContentInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { from, Observable, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import type Canvas from 'diagram-js/lib/core/Canvas';
import type EventBus from 'diagram-js/lib/core/EventBus';
import type { ImportDoneEvent, ImportXMLError, ImportXMLResult } from 'bpmn-js/lib/BaseViewer';
import BpmnJS from 'bpmn-js/lib/Modeler';
import { FileService } from '../../services/file.service';
import { NotificationService } from '../../services/notification.service';
import { IArea } from '../../../modules/area/common/models/area.interface';
import { AreaService } from '../../../modules/area/common/services/area.service';
import { FormWorkflowService } from '../../../modules/workflow/common/services/form-workflow.service';
import { IBpmnCollaboration, IBpmnProcess } from '../../models/bpmn.interface';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrl: './diagram.component.scss'
})
export class DiagramComponent implements AfterContentInit, OnChanges, OnDestroy, OnInit {

  @ViewChild('ref', { static: true }) private el: ElementRef | undefined;
  @Input() url?: string;
  @Input() idDemanda?: number;
  @Output() private importDone: EventEmitter<ImportDoneEvent> = new EventEmitter();
  @Output() fileBPMN = new EventEmitter<File>();
  @Output() pasos = new EventEmitter<string[]>();

  nameWorkflow: string = "newWorkflow"
  xmlLocal: string = ""
  listArea: IArea[] = [];

  idArea = new FormControl<number | null>(null)

  actualBound = `<dc:Bounds x="156" y="62" width="600" height="125" />`
  heightActual = 125
  positionY = 62

  private bpmnJS: BpmnJS = new BpmnJS();
  private loadSubscription?: Subscription;
  private nombreSubscription?: Subscription;
  private readonly onCommandStackChanged = () => this.updateDiagramFile();

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
    this.xmlLocal = xml

    return from(this.bpmnJS.importXML(xml)).pipe(
      tap(() => {
        if (this.idDemanda) {
          this.pasos.emit(this.getTasks());
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
          console.error('No se pudo generar el XML del diagrama.');
        }
      },
      (err) => {
        console.error('Error al exportar el diagrama como XML:', err);
      }
    );
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

  importXMLUpdate() {
    this.bpmnJS.saveXML({ format: true }).then((result) => {
      this.xmlLocal = result?.xml ?? this.xmlLocal
      this.bpmnJS.importXML(this.xmlLocal);
    }).catch((err: Error) => {
      console.error('Error al guardar el XML:', err);
    });
  }

  updateWorkflowName(newName: string): void {
    const rootElement = this.bpmnJS.get<Canvas>('canvas').getRootElement();

    if (!rootElement) {
      console.error('No se pudo acceder al rootElement');
      return;
    }

    const collaboration: IBpmnCollaboration | undefined = rootElement.businessObject;
    if (!collaboration || collaboration.$type !== 'bpmn:Collaboration') {
      console.error('No se encontró el elemento Collaboration.');
      return;
    }

    const participant = collaboration.participants?.find(p => p.name === this.nameWorkflow || p.name == "newWorkflow");
    if (!participant) {
      console.error('No se encontró el participante con el nombre "newWorkflow".');
      return;
    }

    this.nameWorkflow = newName
    participant.name = newName;

    this.importXMLUpdate()
  }

  addAreaToWorkflow() {
    const idArea = this.idArea.value;
    if (idArea == null) {
      this.notification.error('Debe seleccionar un área');
      return;
    }

    const area = this.listArea.find(item => item.id === idArea);
    if (!area)
      return;

    this.addLaneToWorkflow(`Lane_${area.id}`, area.nombre)

    this.listArea = this.listArea.filter(item => item.id !== idArea);

    this.idArea.setValue(null);
  }

  addLaneToLaneSet(xml: string, laneId: string, laneName: string): string {
    const laneTag = `<bpmn:lane id="${laneId}" name="${laneName}" />`;
    const closingLaneSetTag = '</bpmn:laneSet>';

    if (xml.includes(closingLaneSetTag)) {
      return xml.replace(closingLaneSetTag, `${laneTag}\n    ${closingLaneSetTag}`);
    }

    console.error('Etiqueta </bpmn:laneSet> no encontrada.');
    return xml;
  }

  fixWidthHeightTitle(xml: string) {
    this.heightActual = this.heightActual + 125

    const updateBoundParticipant = `<dc:Bounds x="156" y="62" width="600" height="${this.heightActual}" />`

    if (xml.includes(this.actualBound)) {
      let xmlNew = xml.replace(this.actualBound, updateBoundParticipant);
      this.actualBound = updateBoundParticipant
      return xmlNew
    }

    return xml;
  }

  addBpmnShape(xml: string, shapeId: string, elementId: string): string {
    const x = 186;
    const width = 570;
    const height = 125;
    this.positionY = this.positionY + 125;

    const bpmnShape = `
        <bpmndi:BPMNShape id="${shapeId}" bpmnElement="${elementId}" isHorizontal="true">
          <dc:Bounds x="${x}" y="${this.positionY}" width="${width}" height="${height}" />
          <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>`;
    const closingPlaneTag = '</bpmndi:BPMNPlane>';

    if (xml.includes(closingPlaneTag)) {
      return xml.replace(closingPlaneTag, `${bpmnShape}\n    ${closingPlaneTag}`);
    }

    console.error('Etiqueta </bpmndi:BPMNPlane> no encontrada.');
    return xml;
  }

  addLaneToWorkflow(lane: string, area: string) {
    const updatedXmlWithLane = this.addLaneToLaneSet(this.xmlLocal, lane, area);
    const updatedXmlWithParticipant = this.fixWidthHeightTitle(updatedXmlWithLane)
    const updatedXmlWithShape = this.addBpmnShape(updatedXmlWithParticipant, `${lane}_di`, lane);

    this.xmlLocal = updatedXmlWithShape

    this.bpmnJS.importXML(updatedXmlWithShape);
  }

  private getTasks(): string[] {
    const definitions = this.bpmnJS.getDefinitions();
    if (!definitions || !definitions.rootElements) {
      console.error('No se pudieron obtener las definiciones del diagrama.');
      return [];
    }

    const rootElements: IBpmnProcess[] = definitions.rootElements;
    const processes = rootElements.filter(el => el.$type === 'bpmn:Process');
    if (processes.length === 0) {
      console.error('No se encontraron procesos en el diagrama.');
      return [];
    }

    return processes
      .flatMap(process => process.flowElements ?? [])
      .filter(element => element.$type === 'bpmn:Task')
      .map(task => task.name);
  }
}
