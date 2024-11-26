export interface IUsuario {
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


export interface IUsuarioListRequest {
    filtro: string,
    pagina: number,
    totalPorPagina: number
}
