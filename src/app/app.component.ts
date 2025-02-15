import { Component, HostListener, OnInit, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { MainComponent } from './main/main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LeftSidebarComponent,
    MainComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);
  showSidebar = signal<boolean>(false);
  currentRoute = signal<string>(''); // Guarda la ruta actual

  constructor(private router: Router) {}

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    // Detecta cambios de ruta
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Almacena la ruta actual
        this.currentRoute.set(event.urlAfterRedirects);
      }
    });
  }

  // Verifica si la ruta actual es una de las excluidas
  isLoginRoute(): boolean {
    const excludedRoutes = ['/login', '/register'];
    return excludedRoutes.includes(this.currentRoute());
  }

  changeIsLeftSidebarCollapsed(isCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isCollapsed);
  }
}
