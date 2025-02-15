import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent {
  username: string | null = '';

  constructor(private router: Router, private authService: AuthService) {
    this.username = localStorage.getItem('username'); // Recupera el nombre de usuario
  }

  logout(): void {
    this.authService.logout(); // Elimina el token y el username
    console.log('Sesión cerrada correctamente');
    this.router.navigate(['/login']); // Redirige al login
  }
}
