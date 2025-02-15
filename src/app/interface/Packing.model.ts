import { PackagingType } from "./PackagingType.model";
import { Product } from "./product.model";
import { User } from "./user.model";

export interface Packing {
  [x: string]: any;
  idpacking?: number;
  name: string; 
  quantity: number; 
  packagingTypeId: PackagingType; 
  userId?: User; 
  creationDate?: Date; 
  product?: Product; 
}