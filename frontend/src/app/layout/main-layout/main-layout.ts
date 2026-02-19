import { Component, OnDestroy } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, filter } from 'rxjs';
import { NfeRefreshService } from '../../services/nfe-refresh.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent implements OnDestroy {
  username = '';
  pageTitle = 'Upload de XML';
  private routerSubscription: Subscription;

  readonly navItems = [
    { label: 'Upload', icon: '↥', route: '/dashboard/upload' },
    { label: 'Notas de Entrada', icon: '☰', route: '/dashboard/notas-entrada' },
  ];

  constructor(
    private router: Router,
    private nfeRefreshService: NfeRefreshService,
  ) {
    this.username = sessionStorage.getItem('username') || 'Usuário';
    this.updatePageTitle(this.router.url);

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updatePageTitle(event.urlAfterRedirects);

        if (event.urlAfterRedirects === '/dashboard/notas-entrada') {
          this.nfeRefreshService.requestNotasRefresh();
        }
      });
  }

  logout() {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  onNavItemClick(route: string) {
    // Navigation will trigger refresh via NavigationEnd event
    // No need to manually trigger here to avoid duplicate refreshes
  }



  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  private updatePageTitle(url: string) {
    if (url.includes('/notas-entrada/detalhe/')) {
      this.pageTitle = 'Detalhes da Nota';
      return;
    }

    if (url.includes('/notas-entrada')) {
      this.pageTitle = 'Notas de Entrada';
      return;
    }

    this.pageTitle = 'Upload de XML';
  }
}
