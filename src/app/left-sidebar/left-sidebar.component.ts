import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css',
})
export class LeftSidebarComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  isUser:string |null =null;
  items = [
    {
      routeLink: 'products',
      icon: 'fal fa-box-open',
      label: 'Productos',
      user: '',
    },
    {
      routeLink: 'inventario',
      icon: 'fal fa-box',
      label: 'Componentes',
      user: 'ADMIN',
    },
    {
      routeLink: 'creacion-producto',
      icon: 'fal fa-cube',
      label: 'crear producto',
      user: 'ADMIN',
    },
    {
      routeLink: 'formula',
      icon: 'fal fa-cube',
      label: 'crear formula',
      user: 'ADMIN',
    },
    {
      routeLink: 'pages',
      icon: 'fal fa-file',
      label: 'Informe de produccion',
      user: 'ADMIN',
    },
    {
      routeLink: 'settings',
      icon: 'fal fa-cog',
      label: 'Registro de usuario',
      user: 'ADMIN',
    },
    {
      routeLink: 'logout',
      icon: 'fal fa-sign-out-alt',
      label: 'salir',
      user: '',
    },
    
    
    
    
  ];
  ngOnInit(){
    this.isUser = localStorage.getItem("role")
  }
  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}