export interface IWorkflow {
  id: number;
  nombre: string;
  descripcion: string;
  idTipoDemanda: number;
  idTipologia: number;
  idSubtipologia: number;
  bpmn: string;
  estado: number;
}

export interface IWorkflowList {
  id: number;
  nombre: string;
  descripcion: string;
  tipoDemanda: string;
  tipologia: string;
  subtipologia: string;
  estado: number;
}
