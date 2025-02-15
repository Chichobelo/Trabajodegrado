import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Stock } from '../interface/component.model';
import { ComponentsService } from '../services/component.service';
import { DeleteConfirmationModalComponent } from './DeleteConfirmationModal.Component'

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, DeleteConfirmationModalComponent],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  inventory = [
    { name: 'T1', stock: 100, minStock: 50, unit: 'Gramos' },
    { name: 'P2', stock: 150, minStock: 75, unit: 'kilogramos' }
  ];

  componentes: any[] = [];
  searchTerm: string = '';
  showDeleteModal = false;
  itemToDelete: any = null;

  // Definir un umbral para considerar el stock como bajo (porcentaje)
  readonly STOCK_THRESHOLD = 50; // 20% por encima del stock mínimo

  selectedItem: Stock = { name: '', quantity: 0, currentStock: '', minimumStock: '', unitOfMeasurement: '' };
  showCreateModal = false;
  stock: Stock = { name: '', quantity: 0, currentStock: '', minimumStock: '', unitOfMeasurement: '' };
  newChemical = { name: '', quantity: '', currentStock: '', minimumStock: '', unitOfMeasurement: '' };

  currentPage: number = 1;
  itemsPerPage: number = 4;

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

  saveStockProduct(): void {
    this.componentsService.createComponent(this.stock).subscribe(
      (response) => {
        console.log('Component created:', response);
        this.closeCreateModal();
        this.fetchComponents();
      },
      (error) => {
        console.error('Error creating component:', error);
      }
    );
    this.closeCreateModal();    
  }

  updateStockProduct(): void {
    this.componentsService.updateComponent(this.selectedItem.idcomponent, this.selectedItem).subscribe(
      (response) => {
        console.log('Component updated:', response);
        this.closeCreateModal();
        this.fetchComponents();
      },
      (error) => {
        console.error('Error updating component:', error);
      }
    );
    this.closeModal();    
  }

  deleteStockProduct(item: any): void {
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.itemToDelete) {
      this.componentsService.deleteComponent(this.itemToDelete.idcomponent).subscribe(
        () => {
          console.log(`Component with ID ${this.itemToDelete.idcomponent} deleted successfully.`);
          this.fetchComponents();
          this.showDeleteModal = false;
          this.itemToDelete = null;
        },
        (error) => {
          console.error('Error deleting component:', error);
        }
      );
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }
  
  closeModal() {
    this.selectedItem = { name: '', quantity: 0, currentStock: '', minimumStock: '', unitOfMeasurement: '' };
  }

  deleteChemical(item: any) {
    this.inventory = this.inventory.filter(chemical => chemical !== item);
  }

  addChemical() {
    console.log(this.stock);
    if (this.newChemical.name && this.newChemical.quantity) {
      this.inventory.push({
        ...this.newChemical,
        name: '',
        stock: 0,
        minStock: 0,
        unit: ''
      });
      this.closeCreateModal();
    }
  }

  closeCreateModal() {
    this.newChemical = { name: '', quantity: '', currentStock: '', minimumStock: '', unitOfMeasurement: '' };
    this.showCreateModal = false;
  }

  resetNewChemical() {
    this.newChemical = { name: '', quantity: '', currentStock: '', minimumStock: '', unitOfMeasurement: '' };
  }

  openCreateModal() {
    this.showCreateModal = true;
    this.resetNewChemical();
  }

  fetchComponents(): void {
    this.componentsService.getComponents().subscribe(
      (data) => {
        this.componentes = data;
        console.log(this.componentes);
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