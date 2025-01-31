export interface IHistorialDemandaList {
    id?: number;
    usuario?: string;
    paso?: string;
    estado?: number;
    observaciones?: string;
    fecha?: any;
}


export interface IHistorialDemandaListRequest {
    filtro: string,
    pagina: number,
    totalPorPagina: number
}
