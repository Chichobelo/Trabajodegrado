import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ComponentsService } from '../services/component.service';
import { FormulaService } from '../services/formula.service';
import { FormulaWithArrayDTO } from '../interface/formula-with-array-dto.model';
import { Product } from '../interface/product.model';
import { IngredientDTO } from '../interface/ingredient-dto.model';
import { environment } from '../enviroment/enviromen';
import { PackagingType } from '../interface/PackagingType.model';
import { PackingService } from '../services/Packing.service';
import { PackagingTypeService } from '../services/PackagingType.service';
import { Packing } from '../interface/Packing.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  @Output() productionRegistered = new EventEmitter<Packing[]>(); // Emitir datos de producción

  productos: FormulaWithArrayDTO[] = [];
  imgUrl = environment.imgUrl;
  producto: Product[] = [];
  ingredientes: IngredientDTO[] = [];
  
  formula: FormulaWithArrayDTO = {
    producto: 0, 
    ingredientes: [] 
  };

  isLoading = false;
  errorMessage: string | null = null;
  selectComponent: string = "";
  formulas: FormulaWithArrayDTO[] = [];
  selectedProduct: Product = {
    name: '',
    quantity: 0,
    unitOfMeasurement: '',
    category: '',
    imageUrl: ''
  }; // Producto seleccionado para empacar
  operatorId: string = ''; // ID del operador
  packages: Packing[] = []; 
  viewFormulaProduct: FormulaWithArrayDTO = {
    producto: 0, 
    ingredientes: [] 
  }; // Producto seleccionado para ver fórmula

  packagingtypes: PackagingType[] = [];

  selectPackagingtype: String = "";
  productionTableVisible: boolean = false;

  constructor(private productService: ProductService, private componentService: ComponentsService, private formulaService: FormulaService, private packingService: PackingService, private packagingTypeService: PackagingTypeService) {}

  ngOnInit(){
    this.getRecipe();
    this.getPackagingType();
    this.getProducts();
  }

  // Método para mostrar la tabla de producción
  showProductionTable() {
    this.productionTableVisible = true;
  }

  getProducts(){
    this.productService.getAllProducts().subscribe({
      next: (formulasTransformed) => {
        this.producto = formulasTransformed; // Asigna los datos a la propiedad 'formulas'
        this.isLoading = false;
        console.log(this.formulas);
      },
      error: (error) => {
        this.errorMessage = 'No se pudieron cargar las fórmulas transformadas. Intente nuevamente.';
        this.isLoading = false;
        console.error('Error al cargar fórmulas transformadas', error);
      }
    });
  }

  getRecipe() {
    this.formulaService.getAllFormulasTransformed().subscribe({
      next: (formulasTransformed) => {
        this.formulas = formulasTransformed; // Asigna los datos a la propiedad 'formulas'
        this.isLoading = false;
        console.log(this.formulas);
      },
      error: (error) => {
        this.errorMessage = 'No se pudieron cargar las fórmulas transformadas. Intente nuevamente.';
        this.isLoading = false;
        console.error('Error al cargar fórmulas transformadas', error);
      }
    });
  }

  getPackagingType() {
    this.packagingTypeService.getAllPackagingTypes().subscribe({
      next: (packagingType) => {
        this.packagingtypes = packagingType; // Asigna los datos a la propiedad 'formulas'
        this.isLoading = false;
        console.log(this.packagingtypes);
      },
      error: (error) => {
        this.errorMessage = 'No se pudieron cargar las fórmulas transformadas. Intente nuevamente.';
        this.isLoading = false;
        console.error('Error al cargar fórmulas transformadas', error);
      }
    });
  }

  // Método para mostrar la ventana de fórmula
  viewFormula(product: any) {
    this.viewFormulaProduct = product;
  }

  // Método para cerrar la ventana de fórmula
  closeFormula() {
    this.viewFormulaProduct = {
      producto: 0, 
      ingredientes: [] 
    };
  }

  // Método para seleccionar el producto para empacar
  selectProduct(product: any) {
    console.log("awebo", this.producto);
    this.selectedProduct = this.producto.find(
      (product2) => product.producto === product2.idproduct
    ) ?? {
      name: '',
      quantity: 0,
      unitOfMeasurement: '',
      category: '',
      imageUrl: ''
    };
    this.packages = []; // Reiniciar los empaques al seleccionar un nuevo producto
  }

  // Método para agregar un nuevo empaque
  addPackage() {
    this.packages.push({name:"", quantity: 0, packagingTypeId:{idpackagingType:0, name:""} }); // Agregar un empaque inicial
  }

  // Método para eliminar un empaque
  removePackage(index: number) {
    this.packages.splice(index, 1); // Eliminar el empaque en la posición indicada
  }

  // Método para registrar la producción
  registerProduction() {
    this.packages.forEach((packing) => {
      packing.product = this.selectedProduct;
      packing.name = this.selectedProduct.name;
      packing.creationDate = new Date();
      packing.packagingTypeId = this.packagingtypes.find(
        (packagingType) => packagingType.idpackagingType == packing.packagingTypeId.idpackagingType
      ) ?? {name:"",idpackagingType:0};
    });
    console.log('Producción registrada:', {
      product: this.packagingtypes,
      operatorId: this.operatorId,
      packages: this.packages,
    });
    this.packingService.createPacking(this.packages).subscribe({
      next: () => {
        this.operatorId = '';
        this.packages = [];
        this.selectedProduct = {
          name: '',
          quantity: 0,
          unitOfMeasurement: '',
          category: '',
          imageUrl: ''
        };
        this.productionRegistered.emit(this.packages); // Emitir los datos de producción
      },
      error: (error) => {
        this.errorMessage = 'No se pudo crear el producto. Intente nuevamente.';
        this.isLoading = false;
        console.error('Error al crear producto', error);
      }
    });
  }

  // Método para cerrar la ventana de empacar
  closePacking() {
    this.selectedProduct = {
      name: '',
      quantity: 0,
      unitOfMeasurement: '',
      category: '',
      imageUrl: ''
    };
    this.packages = [];
  }
}