export interface Stock {
  idcomponent?: number; 
  name: string;
  quantity: number;
  createdAt?: Date; 
  updatedAt?: Date;
  currentStock: string;
  minimumStock: string;
  unitOfMeasurement: string;
}
