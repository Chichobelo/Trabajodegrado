import { IngredientDTO } from './ingredient-dto.model';

export interface FormulaWithArrayDTO {
  producto: number; 
  nameProducto?:string;
  ingredientes: IngredientDTO[]; 
  urlImagen?: string;
}
