export interface IArea {
    id?: number;
    nombre?: string;
    estado?: number;
}


export interface IAreaListRequest {
    filtro: string,
    pagina: number,
    totalPorPagina: number
}
