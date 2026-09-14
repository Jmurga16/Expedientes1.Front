import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuService } from '../../services/menu.service';
import { IMenu, MenuChangeEvent } from '../../models/menu.interface';
import { TokenService } from '../../../auth/services/token.service';


@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  animations: [
    trigger('children', [
      state('collapsed', style({
        height: '0'
      })),
      state('expanded', style({
        height: '*'
      })),
      transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class MenuItemComponent implements OnInit, OnDestroy {

  @Input() item!: IMenu;

  @Input() index!: number;

  @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;

  @Input() parentKey!: string;

  active = false;

  routeActive = false;

  menuSourceSubscription: Subscription;

  routerSubscription: Subscription;

  key: string = "";

  constructor(public router: Router, private route: ActivatedRoute, private menuService: MenuService, private tokenService: TokenService) {
    this.menuSourceSubscription = this.menuService.menuSource$.subscribe((value: MenuChangeEvent) => {
      Promise.resolve(null).then(() => {
        if (value.routeEvent) {
          this.active = value.key === this.key || value.key.startsWith(this.key + '-');
        }
        else {
          if (value.key !== this.key && !value.key.startsWith(this.key + '-')) {
            this.active = false;
          }
        }
      });
    });

    this.routerSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.item.routerLink) {
          this.updateActiveStateFromRoute();
        }
      });
  }

  ngOnInit() {
    this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);

    if (this.item.routerLink) {
      this.updateActiveStateFromRoute();
    }
  }

  updateActiveStateFromRoute() {
    this.routeActive = this.matchesCurrentRoute();

    if (this.routeActive) {
      this.menuService.onMenuStateChange({ key: this.key, routeEvent: true });
    }
  }

  private matchesCurrentRoute(): boolean {
    const link = this.router.serializeUrl(this.router.createUrlTree(this.item.routerLink, { relativeTo: this.route }));
    const url = this.router.url.split(/[?#]/)[0];

    if (url === link)
      return true;

    if (!link.endsWith('/list'))
      return false;

    const base = link.slice(0, -'/list'.length);
    return url.startsWith(base + '/') && !url.endsWith('/list');
  }

  itemClick(event: Event) {
    if (this.item.action === 'logout') {
      this.tokenService.logOut();
      this.router.navigate(['auth/login']);
    }

    if (this.item.disabled) {
      event.preventDefault();
      return;
    }

    if (this.item.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }

    if (this.item.items) {
      this.active = !this.active;
    }

    this.menuService.onMenuStateChange({ key: this.key });
  }

  get submenuAnimation() {
    return this.root ? 'expanded' : (this.active ? 'expanded' : 'collapsed');
  }

  @HostBinding('class.active-menuitem')
  get activeClass() {
    return this.active && !this.root;
  }

  ngOnDestroy() {
    if (this.menuSourceSubscription) {
      this.menuSourceSubscription.unsubscribe();
    }

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}