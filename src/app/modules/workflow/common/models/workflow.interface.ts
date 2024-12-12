export interface IWorkflow {
    id?: number;
    username?: string;
    roles?: any;
    status?:number;

    idUsuario?: number;
    nombresCompletos?: string;
    rol?: string;
    cuenta?: string;
    estadoUsuario?: string;
}


export interface IWorkflowListRequest {
    filtro: string,
    pagina: number,
    totalPorPagina: number
}
