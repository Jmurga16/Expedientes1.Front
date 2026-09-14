import { MenuItem } from 'primeng/api';

export interface IMenu extends MenuItem {
  action?: 'logout';
  items?: IMenu[];
}

export interface MenuChangeEvent {
  key: string;
  routeEvent?: boolean;
}
