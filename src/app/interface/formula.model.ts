import { Product } from "./product.model";
import { Stock } from "./component.model";
export interface Formula {
  id?: number;
  product?: Product
  stock?: Stock
  amount?: number;
  unitOfMeasurement?: string;
}
