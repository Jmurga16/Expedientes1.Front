export interface ITipologia {
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


export interface ITipologiaListRequest {
    filtro: string,
    pagina: number,
    totalPorPagina: number
}
