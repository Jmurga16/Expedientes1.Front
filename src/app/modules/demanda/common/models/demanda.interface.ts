export interface IDemanda {
    id?: number;
    nombre?: string;
    estado?: number;
}


export interface IDemandaListRequest {
    filtro: string,
    pagina: number,
    totalPorPagina: number
}
