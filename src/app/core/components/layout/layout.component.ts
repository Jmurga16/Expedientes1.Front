import { Component, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { TopbarComponent } from '../topbar/topbar.component';
import { NavigationEnd, Router } from '@angular/router';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy {

  overlayMenuOpenSubscription: Subscription;

  routerSubscription: Subscription;

  menuOutsideClickListener: any;

  @ViewChild(NavMenuComponent) sideBar!: NavMenuComponent;

  @ViewChild(TopbarComponent) topBar!: TopbarComponent;

  constructor(public layoutService: LayoutService, public renderer: Renderer2, public router: Router) {
    this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
      if (!this.menuOutsideClickListener) {
        this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
          const isOutsideClicked = !(this.sideBar.el.nativeElement.isSameNode(event.target) || this.sideBar.el.nativeElement.contains(event.target)
            || this.topBar.menuButton.nativeElement.isSameNode(event.target) || this.topBar.menuButton.nativeElement.contains(event.target));

          if (isOutsideClicked) {
            this.hideMenu();
          }
        });
      }

      if (this.layoutService.state.staticMenuMobileActive) {
        this.blockBodyScroll();
      }
    });

    this.routerSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.hideMenu());
  }

  hideMenu() {
    this.layoutService.state.overlayMenuActive = false;
    this.layoutService.state.staticMenuMobileActive = false;
    this.layoutService.state.menuHoverActive = false;
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
    this.unblockBodyScroll();
  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    }
    else {
      document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    }
    else {
      document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
        'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  get containerClass() {
    return {
      'layout-theme-light': this.layoutService.config.colorScheme === 'light',
      'layout-theme-dark': this.layoutService.config.colorScheme === 'dark',
      'layout-overlay': this.layoutService.config.menuMode === 'overlay',
      'layout-static': this.layoutService.config.menuMode === 'static',
      'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config.menuMode === 'static',
      'layout-overlay-active': this.layoutService.state.overlayMenuActive,
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
      'p-input-filled': this.layoutService.config.inputStyle === 'filled',
      'p-ripple-disabled': !this.layoutService.config.ripple
    }
  }

  ngOnDestroy() {
    this.overlayMenuOpenSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
  }
}