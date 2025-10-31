import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Stock } from '../interface/component.model';
import { ComponentsService } from '../services/component.service';
import { DeleteConfirmationModalComponent } from './DeleteConfirmationModal.Component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, DeleteConfirmationModalComponent],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  componentes: any[] = [];
  searchTerm: string = '';
  showDeleteModal = false;
  itemToDelete: any = null;
  selectedItem: Stock = { name: '', quantity: 0, currentStock: '', minimumStock: '', unitOfMeasurement: '' };
  showCreateModal = false;
  stock: Stock = { name: '', quantity: 0, currentStock: '', minimumStock: '', unitOfMeasurement: '' };
  newChemical = { name: '', quantity: '', currentStock: '', minimumStock: '', unitOfMeasurement: '' };
  currentPage: number = 1;
  itemsPerPage: number = 4;
  readonly STOCK_THRESHOLD = 50;

  constructor(private componentsService: ComponentsService) {}

  ngOnInit(): void {
    this.fetchComponents();
  }

  getStockStatus(currentStock: number, minimumStock: number): 'bajo' | 'suficiente' {
    const difference = ((currentStock - minimumStock) / minimumStock) * 100;
    return difference <= this.STOCK_THRESHOLD ? 'bajo' : 'suficiente';
  }

  getStatusColor(status: string): string {
    return status === 'bajo' ? 'badge-low' : 'badge-sufficient';
  }

  get paginatedComponents(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.getFilteredComponents().slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.getFilteredComponents().length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getFilteredComponents(): any[] {
    if (!this.searchTerm) {
      return this.componentes;
    }
    const term = this.searchTerm.toLowerCase();
    return this.componentes.filter(item =>
      item.name.toLowerCase().includes(term)
    );
  }

  editStock(item: any) {
    this.selectedItem = item;
  }

  /** ✅ Crear un nuevo componente con validaciones y alertas */
  saveStockProduct(): void {
    if (!this.stock.name || !this.stock.unitOfMeasurement || !this.stock.currentStock || !this.stock.minimumStock) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos antes de guardar.',
        confirmButtonColor: '#2162a7'
      });
      return;
    }

    this.componentsService.createComponent(this.stock).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Componente creado',
          text: 'El componente se registró exitosamente.',
          showConfirmButton: false,
          timer: 1500,
          background: '#f4f7fc'
        });
        this.closeCreateModal();
        this.fetchComponents();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear',
          text: 'Ocurrió un problema al registrar el componente.',
          confirmButtonColor: '#d33'
        });
        console.error('Error creating component:', error);
      }
    );
  }

  /** ✅ Actualizar componente con validación y alerta */
  updateStockProduct(): void {
    if (!this.selectedItem.name || !this.selectedItem.unitOfMeasurement || !this.selectedItem.currentStock || !this.selectedItem.minimumStock) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos antes de actualizar.',
        confirmButtonColor: '#2162a7'
      });
      return;
    }

    this.componentsService.updateComponent(this.selectedItem.idcomponent, this.selectedItem).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Componente actualizado',
          text: 'Los datos se actualizaron correctamente.',
          showConfirmButton: false,
          timer: 1500,
          background: '#f4f7fc'
        });
        this.closeModal();
        this.fetchComponents();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: 'No se pudo actualizar el componente.',
          confirmButtonColor: '#d33'
        });
        console.error('Error updating component:', error);
      }
    );
  }

  /** ✅ Eliminar componente con confirmación */
  deleteStockProduct(item: any): void {
    Swal.fire({
      title: '¿Eliminar componente?',
      text: `¿Deseas eliminar "${item.name}" del inventario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#2162a7',
    }).then((result) => {
      if (result.isConfirmed) {
        this.componentsService.deleteComponent(item.idcomponent).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El componente fue eliminado correctamente.',
              showConfirmButton: false,
              timer: 1200
            });
            this.fetchComponents();
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: 'No se pudo eliminar el componente.',
              confirmButtonColor: '#d33'
            });
            console.error('Error deleting component:', error);
          }
        );
      }
    });
  }

  /** ✅ Utilidades y helpers */
  closeModal() {
    this.selectedItem = { name: '', quantity: 0, currentStock: '', minimumStock: '', unitOfMeasurement: '' };
  }

  closeCreateModal() {
    this.stock = { name: '', quantity: 0, currentStock: '', minimumStock: '', unitOfMeasurement: '' };
    this.showCreateModal = false;
  }

  openCreateModal() {
    this.showCreateModal = true;
    this.stock = { name: '', quantity: 0, currentStock: '', minimumStock: '', unitOfMeasurement: '' };
  }

  fetchComponents(): void {
    this.componentsService.getComponents().subscribe(
      (data) => {
        this.componentes = data;
      },
      (error) => {
        console.error('Error fetching components:', error);
      }
    );
  }

  filterData() {
    console.log('Buscando componentes:', this.searchTerm);
  }
}
