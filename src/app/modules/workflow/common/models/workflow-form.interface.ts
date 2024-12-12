export interface IWorkflowForm {
  id?: number,
  name: string,
  lastname: string,
  dni: string,
  address?: string,
  username?: string,
  email: string,
  password: string,
  status: number,
  roles: IDiagramForm[],
}

export interface IDiagramForm {
  id: number;
}