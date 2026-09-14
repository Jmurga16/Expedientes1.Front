export interface IWorkflowForm {
  id: number | null;
  nombre: string;
  descripcion: string;
  idTipoDemanda: number;
  idTipologia: number;
  idSubtipologia: number;
  bpmn: string | null;
  estado: number;
}
