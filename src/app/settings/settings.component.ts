import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { RegisterRequest, Role } from '../interface/registerRequest.model';
import { AuthResponse } from '../interface/AuthResponse.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  user: RegisterRequest[] = [];
  searchTerm = '';
  showModal = false;
  isEditing = false;

  role: string = '';
  currentUser: RegisterRequest = {
    role: Role.USER,
    username: '',
    lastname: '',
    firstname: '',
    password: '',
    id: 0
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  /** 🔹 Cargar todos los usuarios */
  loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (users) => (this.user = users),
      error: (error) => {
        console.error('Error fetching workers', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar usuarios',
          text: 'No se pudieron obtener los datos de los trabajadores.',
          confirmButtonColor: '#2162a7'
        });
      }
    });
  }

  /** 🔹 Filtrar usuarios según búsqueda */
  filteredUsers() {
    if (!this.searchTerm) return this.user;
    return this.user.filter((u) =>
      u.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /** 🔹 Abrir modal para crear usuario nuevo */
  openNewUsersForm() {
    this.isEditing = false;
    this.currentUser = {
      role: Role.USER,
      username: '',
      lastname: '',
      firstname: '',
      password: '',
      id: 0
    };
    this.role = '';
    this.showModal = true;
  }

  /** 🔹 Editar usuario existente */
  editUser(user: RegisterRequest) {
    this.isEditing = true;
    this.currentUser = { ...user };
    this.currentUser.password = '';
    this.role = this.currentUser.role === Role.ADMIN ? 'admin' : 'user';
    this.showModal = true;
  }

  /** 🔹 Eliminar usuario con confirmación segura */
  deleteUser(user: RegisterRequest) {
    Swal.fire({
      title: '¿Eliminar trabajador?',
      text: `¿Deseas eliminar a "${user.firstname} ${user.lastname}" del sistema?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && user.id != null) {
        this.authService.deleteUser(user.id).subscribe({
          next: () => {
            this.loadUsers();
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El trabajador ha sido eliminado correctamente.',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el trabajador. Intente nuevamente.'
            });
          }
        });
      } else if (result.isConfirmed) {
        Swal.fire({
          icon: 'error',
          title: 'Error de ID',
          text: 'No se encontró un identificador válido para eliminar.',
          confirmButtonColor: '#2162a7'
        });
      }
    });
  }

  /** 🔹 Cerrar modal */
  closeModal(): void {
    this.showModal = false;
  }

  /** 🔹 Registrar o actualizar trabajador con validaciones seguras */
  register(): void {
    // ✅ Validaciones con SweetAlert2
    if (!this.currentUser.firstname.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor ingresa el nombre del trabajador.',
        confirmButtonColor: '#2162a7'
      });
      return;
    }

    if (!this.currentUser.lastname.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor ingresa el apellido del trabajador.',
        confirmButtonColor: '#2162a7'
      });
      return;
    }

    if (!this.currentUser.username.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor ingresa el nombre de usuario.',
        confirmButtonColor: '#2162a7'
      });
      return;
    }

    if (!this.role) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor selecciona un rol.',
        confirmButtonColor: '#2162a7'
      });
      return;
    }

    if (!this.isEditing && !this.currentUser.password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor ingresa una contraseña.',
        confirmButtonColor: '#2162a7'
      });
      return;
    }

    const userPayload: RegisterRequest = {
      username: this.currentUser.username,
      lastname: this.currentUser.lastname,
      firstname: this.currentUser.firstname,
      password: this.currentUser.password,
      role: this.role === 'admin' ? Role.ADMIN : Role.USER
    };

    /** 🧠 Si es edición */
    if (this.isEditing) {
      if (this.currentUser.id != null) {
        this.authService.updateUser(this.currentUser.id, userPayload).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado',
              text: 'El trabajador ha sido actualizado correctamente.',
              timer: 1300,
              showConfirmButton: false
            });
            this.showModal = false;
            this.loadUsers();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar el trabajador. Intenta nuevamente.'
            });
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error de ID',
          text: 'No se encontró un identificador válido para actualizar.',
          confirmButtonColor: '#2162a7'
        });
      }
    } 
    /** 🧩 Si es creación */
    else {
      this.authService.register(userPayload).subscribe({
        next: (response: AuthResponse) => {
          Swal.fire({
            icon: 'success',
            title: 'Registrado',
            text: 'El trabajador fue registrado correctamente.',
            timer: 1300,
            showConfirmButton: false
          });
          this.showModal = false;
          this.loadUsers();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo registrar el trabajador. Intenta nuevamente.'
          });
        }
      });
    }
  }
}
