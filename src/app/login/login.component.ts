import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], // Asegúrate de incluir FormsModule y CommonModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Cambiado a styleUrls
})
export class loginComponent {
  mensajeError: string = '';
  usuario = '';
  contraseña = '';
  password: any;
  

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.mensajeError = ''; // Limpia cualquier mensaje previo
    this.authService.login(this.usuario, this.password).subscribe(
      (response) => {
        console.log('user logged', response);
        this.router.navigate(['/products']);
      },
      (error) => {
        console.error('Error login', error);
        // Muestra un mensaje de error al usuario
        this.mensajeError = 'Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.';
      }
    );
  }
}
