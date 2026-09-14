import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { TokenService } from '../../../auth/services/token.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({ selector: 'app-topbar', templateUrl: './topbar.component.html', styleUrls: ['./topbar.component.scss'] })
export class TopbarComponent implements OnInit {
  section = 'Inicio';
  @ViewChild('menubutton') menuButton!: ElementRef;

  constructor(public layoutService: LayoutService, private tokenService: TokenService, private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => this.updateSection());
  }

  ngOnInit(): void { this.updateSection(); }

  logout() { this.tokenService.logOut(); this.router.navigate(['auth/login']); }

  private updateSection(): void {
    const path = this.router.url.split('?')[0];
    const sections: { [key: string]: string } = {
      '/admin/home': 'Inicio',
      '/admin/user': 'Usuarios',
      '/admin/tipologia/subtipologia': 'Subtipologías',
      '/admin/tipologia': 'Tipologías',
      '/admin/area': 'Áreas',
      '/admin/demanda': 'Demandas',
      '/admin/workflow': 'Flujos de trabajo'
    };
    const sectionKey = Object.keys(sections).find(key => path.startsWith(key));
    this.section = sectionKey ? sections[sectionKey] : 'Inicio';
    document.title = `NEXO | ${this.section}`;
  }
}
