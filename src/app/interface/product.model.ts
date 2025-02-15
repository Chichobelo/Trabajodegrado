import { User } from "./user.model";

export interface Product {
    idproduct?: number;
    name: string;
    quantity: number;
    creationDate?: Date;
    updateDate?: Date;
    unitOfMeasurement?: string;
    category?: string;
    location?: Location;
    user?: User;
    imageUrl?: string; // Nuevo campo para la URL de la imagen
  }