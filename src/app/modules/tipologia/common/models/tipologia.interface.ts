export interface ITipologia {
    id?: number;
    nombre?: string;
    descripcion?: any;
    estado?: number;
}

export interface ITipologiaListRequest {
    filtro: string,
    pagina: number,
    totalPorPagina: number
}
