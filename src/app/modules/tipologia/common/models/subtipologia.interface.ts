export interface ISubtipologia {
    id?: number;
    nombre?: string;
    idTipologia?: number;
    estadoUsuario?: string;
}

export interface ITipologiaListRequest {
    filtro: string,
    pagina: number,
    totalPorPagina: number
}
