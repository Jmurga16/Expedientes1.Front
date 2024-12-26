export interface IMenu {
    label: string
    items: IMenuItem[]
    separator?: any
}

interface IMenuItem {
    label: string,
    icon: string,
    routerLink: any
}