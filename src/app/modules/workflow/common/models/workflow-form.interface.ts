export interface IWorkflowForm {
  id?: number,
  nombre: string,
  idTipoDemanda: number,
  idTipologia: number,
  idSubtipologia: number,
  descripcion?: string,
  bpmn?: string
  estado?: number
}

export interface IDiagramForm {
  id: number;
}