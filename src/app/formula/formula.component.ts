import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
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
  formula: FormulaWithArrayDTO = { producto: 0, ingredientes: [] };

  isLoading = false;
  errorMessage: string | null = null;
  selectComponent: string = '';
  formulas: FormulaWithArrayDTO[] = [];
  selectedProducto?: number;
  editingFormulaIndex: number | null = null;
  isModalOpen = false;
  busqueda: string = '';
  componentes: Stock[] = [];

  // Navegación
  currentFormulaIndex: number = 0;
  itemsPerPage: number = 1;
  totalPages: number = 0;
  formulasPaginadas: FormulaWithArrayDTO[] = [];

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

  /** 🧩 Cargar productos */
  getProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (productos) => {
        this.producto = productos || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;

        // Evitar alerta si simplemente no hay productos aún
        if (error.status === 404 || error.status === 0 || error.status === 500) {
          this.producto = [];
          console.warn('⚠️ No se encontraron productos todavía.');
          return;
        }

        // Mostrar alerta solo en errores inesperados
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar productos',
          text: 'Ocurrió un problema inesperado. Intente nuevamente.',
          confirmButtonColor: '#2162a7',
        });
        console.error('Error al cargar productos:', error);
      },
    });
  }

  /** 🧩 Cargar componentes */
  getComponents() {
    this.isLoading = true;
    this.componentService.getComponents().subscribe({
      next: (productos) => {
        this.componentes = productos || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 404 || error.status === 0 || error.status === 500) {
          this.componentes = [];
          console.warn('⚠️ No se encontraron componentes todavía.');
          return;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error al cargar componentes',
          text: 'Ocurrió un problema inesperado. Intente nuevamente.',
          confirmButtonColor: '#2162a7',
        });
        console.error('Error al cargar componentes:', error);
      },
    });
  }

  /** 🧩 Cargar fórmulas */
  getRecipe() {
    this.isLoading = true;
    this.formulaService.getAllFormulasTransformed().subscribe({
      next: (formulasTransformed) => {
        this.formulas = formulasTransformed || [];
        this.totalPages = Math.ceil(this.formulas.length / this.itemsPerPage);
        this.actualizarFormulasPaginadas();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 404 || error.status === 0 || error.status === 500) {
          // No hay fórmulas, no mostrar alerta
          this.formulas = [];
          this.totalPages = 0;
          console.warn('⚠️ No se encontraron fórmulas todavía.');
          return;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error al cargar fórmulas',
          text: 'Ocurrió un problema inesperado. Intente nuevamente.',
          confirmButtonColor: '#2162a7',
        });
        console.error('Error al cargar fórmulas:', error);
      },
    });
  }

  /** 📄 Paginación */
  actualizarFormulasPaginadas() {
    const startIndex = this.currentFormulaIndex * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.formulasPaginadas = this.formulas.slice(startIndex, endIndex);
  }

  irAFormulaAnterior() {
    if (this.currentFormulaIndex > 0) {
      this.currentFormulaIndex--;
      this.actualizarFormulasPaginadas();
    }
  }

  irAFormulaSiguiente() {
    if (this.currentFormulaIndex < this.totalPages - 1) {
      this.currentFormulaIndex++;
      this.actualizarFormulasPaginadas();
    }
  }

  /** ➕ Modal Crear/Editar */
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

  /** 💾 Guardar fórmula */
  guardarFormula() {
    if (!this.selectedProducto) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor selecciona un producto.',
        confirmButtonColor: '#2162a7',
      });
      return;
    }

    if (this.ingredientes.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan ingredientes',
        text: 'Agrega al menos un ingrediente antes de guardar.',
        confirmButtonColor: '#2162a7',
      });
      return;
    }

    this.formula.producto = this.selectedProducto;
    this.formula.ingredientes = this.ingredientes;

    this.isLoading = true;
    this.formulaService.createFormulaWithIngredients(this.formula).subscribe({
      next: () => {
        this.isLoading = false;
        this.cerrarModal();
        this.getRecipe();
        Swal.fire({
          icon: 'success',
          title: 'Fórmula guardada',
          text: 'La fórmula fue registrada exitosamente.',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: 'No se pudo guardar la fórmula. Intente nuevamente.',
          confirmButtonColor: '#2162a7',
        });
        console.error('Error al guardar fórmula:', error);
      },
    });
  }

  /** ✏️ Editar fórmula */
  editarFormula(formula: FormulaWithArrayDTO) {
    this.isModalOpen = true;
    this.selectedProducto = formula.producto;
    this.ingredientes = JSON.parse(JSON.stringify(formula.ingredientes));
  }

  /** 🗑️ Eliminar fórmula */
  eliminarFormula(formula: FormulaWithArrayDTO) {
    Swal.fire({
      title: '¿Eliminar fórmula?',
      text: `¿Deseas eliminar la fórmula del producto "${formula.nameProducto}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#2162a7',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.formulaService.deleteFormulasByProductId(formula.producto).subscribe({
          next: () => {
            this.getRecipe();
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'La fórmula fue eliminada correctamente.',
              showConfirmButton: false,
              timer: 1200,
            });
          },
          error: (error) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: 'No se pudo eliminar la fórmula. Intente nuevamente.',
              confirmButtonColor: '#2162a7',
            });
            console.error('Error al eliminar fórmula:', error);
          },
        });
      }
    });
  }
}
