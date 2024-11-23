export interface IUsuario {
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
