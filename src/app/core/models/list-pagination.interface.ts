export class IListWithPaginationRequest {
    filtro: string
    pagina: number
    totalPorPagina: number

    constructor(filtro: string, pagina: number, totalPorPagina: number) {
        this.filtro = "";
        this.pagina = 1;
        this.totalPorPagina = 10;
    }
}

export class IListWithPaginationResponse {
    pageIndex: number
    totalPages: number
    totalCount: number
    hasPreviousPage: boolean
    hasNextPage: boolean

    constructor(pageIndex: number, totalPages: number, totalCount: number, hasPreviousPage: boolean, hasNextPage: boolean) {
        this.pageIndex = pageIndex;
        this.totalPages = totalPages;
        this.totalCount = totalCount;
        this.hasPreviousPage = hasPreviousPage;
        this.hasNextPage = hasNextPage;
    }
}