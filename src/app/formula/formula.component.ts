import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ComponentsService } from '../services/component.service';
import { Stock } from '../interface/component.model';
import { Product } from '../interface/product.model';
import { FormulaWithArrayDTO } from '../interface/formula-with-array-dto.model';
import { IngredientDTO } from '../interface/ingredient-dto.model';
import { FormulaService } from '../services/formula.service';

@Component({
  selector: 'app-formula',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css'],
})
export class FormulaComponent {
  productos: FormulaWithArrayDTO[] = [];
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
  selectedProducto?: number;
  editingFormulaIndex: number | null = null;
  isModalOpen = false;
  isDeleteModalOpen = false;
  formulaToDelete: FormulaWithArrayDTO | null = null;
  busqueda: string = '';
  componentes: Stock[] = [];

  // Nuevas variables para controlar la navegación de fórmulas
  currentFormulaIndex: number = 0; // Índice de la fórmula actual
  itemsPerPage: number = 1;        // Número de fórmulas por página
  totalPages: number = 0;          // Total de páginas
  formulasPaginadas: FormulaWithArrayDTO[] = []; // Fórmulas visibles en la página actual

  constructor(
    private productService: ProductService,
    private componentService: ComponentsService,
    private formulaService: FormulaService
  ) {}

  ngOnInit() {
    this.getComponents();
    this.getProducts();
    this.getRecipe();
  }

  getProducts() {
    this.productService.getAllProducts().subscribe({
      next: (productos) => {
        this.producto = productos;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'No se pudieron cargar los productos. Intente nuevamente.';
        this.isLoading = false;
        console.error('Error al cargar productos', error);
      }
    });
  }

  getRecipe() {
    this.formulaService.getAllFormulasTransformed().subscribe({
      next: (formulasTransformed) => {
        this.formulas = formulasTransformed;
        this.totalPages = Math.ceil(this.formulas.length / this.itemsPerPage);
        this.actualizarFormulasPaginadas();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'No se pudieron cargar las fórmulas transformadas. Intente nuevamente.';
        this.isLoading = false;
        console.error('Error al cargar fórmulas transformadas', error);
      }
    });
  }

  getComponents() {
    this.componentService.getComponents().subscribe({
      next: (productos) => {
        this.componentes = productos;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'No se pudieron cargar los productos. Intente nuevamente.';
        this.isLoading = false;
        console.error('Error al cargar productos', error);
      }
    });
  }

  // Actualizar las fórmulas visibles según la página actual
  actualizarFormulasPaginadas() {
    const startIndex = this.currentFormulaIndex * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.formulasPaginadas = this.formulas.slice(startIndex, endIndex);
  }

  // Función para ir a la fórmula anterior
  irAFormulaAnterior() {
    if (this.currentFormulaIndex > 0) {
      this.currentFormulaIndex--;
      this.actualizarFormulasPaginadas();
    }
  }

  // Función para ir a la fórmula siguiente
  irAFormulaSiguiente() {
    if (this.currentFormulaIndex < this.totalPages - 1) {
      this.currentFormulaIndex++;
      this.actualizarFormulasPaginadas();
    }
  }

  // Función para obtener la fórmula actual
  obtenerFormulaActual() {
    return this.formulasPaginadas[0]; // Solo se muestra una fórmula por página
  }

  abrirModal(isEditMode: boolean = false) {
    this.isModalOpen = true;
    if (!isEditMode) {
      this.selectedProducto = 0;
      this.ingredientes = [];
      this.editingFormulaIndex = null;
    }
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.selectedProducto = 0;
    this.ingredientes = [];
    this.editingFormulaIndex = null;
  }

  agregarIngrediente() {
    this.ingredientes.push({ nombre: 0, name: '', cantidad: 0, unidad: '' });
  }

  eliminarIngrediente(index: number) {
    this.ingredientes.splice(index, 1);
  }

  guardarFormula() {
    this.formula.producto = this.selectedProducto != null ? this.selectedProducto : 0;
    this.formula.ingredientes = this.ingredientes;

    this.formulaService.createFormulaWithIngredients(this.formula).subscribe({
      next: (response: any) => {
        this.cerrarModal();
        this.getRecipe();
      },
      error: (error: any) => {
        this.errorMessage = 'No se pudo guardar la fórmula. Intente nuevamente.';
        this.isLoading = false;
        console.error('Error al guardar la fórmula', error);
      }
    });
  }

  editarFormula(productos: FormulaWithArrayDTO) {
    this.isModalOpen = true;
    this.selectedProducto = productos.producto;
    this.ingredientes = productos.ingredientes;
  }

  eliminarFormula(formula: FormulaWithArrayDTO) {
    this.formulaToDelete = formula;
    this.isDeleteModalOpen = true;
  }

  confirmarEliminacion() {
    if (this.formulaToDelete) {
      this.formulaService.deleteFormulasByProductId(this.formulaToDelete.producto).subscribe({
        next: () => {
          this.getRecipe();
          this.cerrarModalEliminar();
        },
        error: (error) => {
          this.errorMessage = 'No se pudo eliminar la fórmula. Intente nuevamente.';
          console.error('Error al eliminar la fórmula', error);
        }
      });
    }
  }

  cerrarModalEliminar() {
    this.isDeleteModalOpen = false;
    this.formulaToDelete = null;
  }

  filtrarFormulas() {
    return this.formulas;
  }
}
