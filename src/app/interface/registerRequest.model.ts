
export interface RegisterRequest {
    id?:number;
    username: string;   // Nombre de usuario
    password: string;   // Contraseña
    firstname: string;  // Nombre
    lastname: string;   // Apellido
    role: Role;
  }
  export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
  }