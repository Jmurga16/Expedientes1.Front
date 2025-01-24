import { AfterContentInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, SimpleChanges, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

import type Canvas from 'diagram-js/lib/core/Canvas';
import type { ImportDoneEvent, ImportXMLResult } from 'bpmn-js/lib/BaseViewer';
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling';

// Importa el tipo de Modeling
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
import { AreaService } from '../../../modules/area/common/services/area.service';
import { FormControl } from '@angular/forms';

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

  nameWorkflow: string = "newWorkflow"
  xmlLocal: any
  isWorkflow: boolean = true
  listArea: any;

  idArea = new FormControl()

  private bpmnJS: BpmnJS = new BpmnJS();

  constructor(
    private http: HttpClient,
    private fileService: FileService,
    private areaService: AreaService
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
    this.getAreas()
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

    console.log("loadUrl")
    console.log(url)

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

    console.log("importDiagram")
    console.log(xml)
    this.xmlLocal = xml

    const eventBus = this.bpmnJS.get('eventBus') as any; // Aserción de tipo
    eventBus.on('commandStack.changed', () => {
      console.log('Cambio detectado en el diagrama');
      console.log(this.bpmnJS);
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

  getAreas() {
    this.areaService.getActives().subscribe({
      next: (response: any) => {
        this.listArea = response;
      }
    });
  }

  importXMLUpdate() {
    this.bpmnJS.saveXML({ format: true }).then((result: any) => {
      this.bpmnJS.importXML(result.xml);
    }).catch((err: any) => {
      console.error('Error al guardar el XML:', err);
    });
  }

  updateWorkflowName(newName: string): void {
    const moddle = this.bpmnJS.get('moddle') as any; // Obtén el moddle para manipular elementos BPMN
    const canvas = this.bpmnJS.get<Canvas>('canvas');
    const rootElement = canvas.getRootElement() as any;

    if (!rootElement || !moddle) {
      console.error('No se pudo acceder al rootElement o moddle');
      return;
    }

    // Busca el elemento Collaboration en el modelo
    const collaboration = rootElement.businessObject;
    if (!collaboration || collaboration.$type !== 'bpmn:Collaboration') {
      console.error('No se encontró el elemento Collaboration.');
      return;
    }

    // Encuentra el participante en el Collaboration
    const participant = collaboration.participants?.find((p: any) => p.name === this.nameWorkflow);
    if (!participant) {
      console.error('No se encontró el participante con el nombre "newWorkflow".');
      return;
    }

    // Actualiza el nombre del participante
    this.nameWorkflow = newName
    participant.name = newName;

    // Importa nuevamente el XML actualizado
    this.importXMLUpdate()
  }

  addLane(): void {
    const moddle = this.bpmnJS.get('moddle') as any; // Obtener moddle para crear elementos BPMN
    const modeling = this.bpmnJS.get<Modeling>('modeling'); // Obtener servicio de modeling
    const canvas = this.bpmnJS.get('canvas') as any; // Obtener canvas

    const rootElement = canvas.getRootElement() as any;

    if (!rootElement || !moddle || !modeling) {
      console.error('No se pudo acceder a rootElement, moddle o modeling.');
      return;
    }

    const process = rootElement.businessObject.$type === 'bpmn:Process'
      ? rootElement.businessObject
      : rootElement.businessObject.flowElements?.find((el: any) => el.$type === 'bpmn:Process');

    if (!process) {
      console.error('No se encontró el proceso en el diagrama.');
      return;
    }

    let laneSet = process.laneSets?.[0];
    if (!laneSet) {
      laneSet = moddle.create('bpmn:LaneSet', { id: `LaneSet_${Date.now()}` });
      process.laneSets = [laneSet];
    }

    const newLane = moddle.create('bpmn:Lane', {
      id: `Lane_${Date.now()}`,
      name: `New Lane ${laneSet.lanes?.length + 1 || 1}`,
    });

    laneSet.lanes = laneSet.lanes || [];
    laneSet.lanes.push(newLane);

    modeling.updateProperties(process, {
      laneSets: process.laneSets,
    });

    console.log('Nuevo Lane agregado:', newLane);
  }

  addLaneToLaneSet2(xml: string, laneId: string, laneName: string): string {
    const laneTag = `<bpmn:lane id="${laneId}" name="${laneName}" />`;
    const closingLaneSetTag = '</bpmn:laneSet>';

    if (xml.includes(closingLaneSetTag)) {
      // Inserta el nuevo lane antes de la etiqueta de cierre de laneSet
      return xml.replace(closingLaneSetTag, `${laneTag}\n    ${closingLaneSetTag}`);
    }

    console.error('Etiqueta </bpmn:laneSet> no encontrada.');
    return xml;
  }

  addBpmnShape2(xml: string, shapeId: string, elementId: string, x: number, y: number, width: number, height: number): string {
    const bpmnShape = `
        <bpmndi:BPMNShape id="${shapeId}" bpmnElement="${elementId}" isHorizontal="true">
          <dc:Bounds x="${x}" y="${y}" width="${width}" height="${height}" />
          <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>`;
    const closingPlaneTag = '</bpmndi:BPMNPlane>';

    if (xml.includes(closingPlaneTag)) {
      // Inserta el nuevo BPMNShape antes de la etiqueta de cierre de BPMNPlane
      return xml.replace(closingPlaneTag, `${bpmnShape}\n    ${closingPlaneTag}`);
    }

    console.error('Etiqueta </bpmndi:BPMNPlane> no encontrada.');
    return xml;
  }

  addLaneTest() {
    const originalXml = this.xmlLocal;

    // Agregar un nuevo lane
    const updatedXmlWithLane = this.addLaneToLaneSet(originalXml, 'Lane_1', 'areaC');

    // Agregar un nuevo BPMNShape
    const updatedXmlWithShape = this.addBpmnShape2(
      updatedXmlWithLane, // XML ya actualizado con el nuevo lane
      'Lane_1_di',
      'Lane_1',
      186,  // x
      312,  // y (ajustado para que esté debajo de la última lane existente)
      570,  // width
      125   // height
    );


    console.log("updatedXmlWithShape");
    console.log(updatedXmlWithShape);

    this.bpmnJS.importXML(updatedXmlWithShape);

  }

  addAreaToWorkflow() {
    let nameArea: string = ""
    let nameLane: string = ""

    this.listArea.forEach((element: any) => {
      if (this.idArea.value == element.id) {
        nameArea = element.nombre
        nameLane = `Lane_${element.id}`
      }
    });

    this.addLaneToWorkflow(nameLane, nameArea)


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

  actualBound = `<dc:Bounds x="156" y="62" width="600" height="125" />`
  heightActual = 125
  positionY = 62

  fixWidthHeightTitle(xml: string) {

    this.heightActual = this.heightActual + 125

    console.log(this.heightActual)

    const updateBoundParticipant = `<dc:Bounds x="156" y="62" width="600" height="${this.heightActual}" />`


    if (xml.includes(this.actualBound)) {
      let xmlNew = xml.replace(this.actualBound, updateBoundParticipant);
      this.actualBound = updateBoundParticipant
      return xmlNew
    }
    
    return xml;
  }



  addBpmnShape(xml: string, shapeId: string, elementId: string): string {

    let x = 186;
    this.positionY = this.positionY + 125;
    let width = 570;
    let height = 125;


    const bpmnShape = `
        <bpmndi:BPMNShape id="${shapeId}" bpmnElement="${elementId}" isHorizontal="true">
          <dc:Bounds x="${x}" y="${this.positionY}" width="${width}" height="${height}" />
          <bpmndi:BPMNLabel />
        </bpmndi:BPMNShape>`;
    const closingPlaneTag = '</bpmndi:BPMNPlane>';

    if (xml.includes(closingPlaneTag)) {
      // Inserta el nuevo BPMNShape antes de la etiqueta de cierre de BPMNPlane
      return xml.replace(closingPlaneTag, `${bpmnShape}\n    ${closingPlaneTag}`);
    }

    console.error('Etiqueta </bpmndi:BPMNPlane> no encontrada.');
    return xml;
  }

  addLaneToWorkflow(lane: string, area: string) {
    const originalXml = this.xmlLocal;

    // Agregar un nuevo lane
    const updatedXmlWithLane = this.addLaneToLaneSet(originalXml, lane, area);

    const updatedXmlWithParticipant = this.fixWidthHeightTitle(updatedXmlWithLane)


    // Agregar un nuevo BPMNShape
    const updatedXmlWithShape = this.addBpmnShape(
      updatedXmlWithParticipant, // XML ya actualizado con el nuevo lane
      `${lane}_di`,
      lane
    );



    console.log("updatedXmlWithShape");
    console.log(updatedXmlWithShape);

    this.xmlLocal = updatedXmlWithShape

    this.bpmnJS.importXML(updatedXmlWithShape);

  }

}