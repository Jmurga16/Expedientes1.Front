import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
  @Input() item: any;
  @Input() index!: number;
  @Input() root: boolean = false;

  itemClick(event: Event) {
    event.preventDefault();
    if (this.item.command) {
      this.item.command();
    }
  }
}