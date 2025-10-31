import { Component, OnInit } from '@angular/core';
import { PackingService } from '../services/Packing.service';
import { Packing } from '../interface/Packing.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
})
export class PagesComponent implements OnInit {
  packings: Packing[] = [];
  filteredPackings: Packing[] = [];
  paginatedPackings: Packing[] = [];
  searchText: string = '';
  startDate: string = '';
  endDate: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private packingService: PackingService) {}

  ngOnInit(): void {
    this.packingService.getAllPackings().subscribe((data: Packing[]) => {
      this.packings = data;
      this.filteredPackings = data;
      this.totalPages = Math.ceil(this.filteredPackings.length / this.itemsPerPage);
      this.updatePaginatedPackings();
    });
  }

  filterPackings(): void {
    this.filteredPackings = this.packings.filter(packing => {
      const matchesText =
        packing.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        packing.packagingTypeId.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesStartDate =
        !this.startDate || (packing.creationDate && new Date(packing.creationDate) >= new Date(this.startDate));
      const matchesEndDate =
        !this.endDate || (packing.creationDate && new Date(packing.creationDate) <= new Date(this.endDate));
      return matchesText && matchesStartDate && matchesEndDate;
    });

    this.totalPages = Math.ceil(this.filteredPackings.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedPackings();
  }

  updatePaginatedPackings(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPackings = this.filteredPackings.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPackings();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPackings();
    }
  }

  descargarInforme(): void {
  const encabezados = ['ID', 'Nombre', 'Cantidad', 'Tipo de Empaque', 'Fecha de Creación'];

  // Construir filas con los datos filtrados
  const filas = this.filteredPackings.map(p => [
    p.idpacking,
    this.sanitizeText(p.name),
    p.quantity,
    this.sanitizeText(p.packagingTypeId?.name || 'Sin tipo'),
    this.formatDate(p.creationDate)
  ]);

  // Unir encabezados y filas usando punto y coma como delimitador
  const csvArray = [encabezados, ...filas].map(row => row.join(';')).join('\n');

  // Añadir BOM para compatibilidad con Excel y evitar errores de acentos
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvArray], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);

  // Crear enlace temporal de descarga
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'informe_produccion.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** ✅ Formato seguro de fechas */
private formatDate(date: any): string {
  if (!date) return 'Sin fecha';
  try {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return 'Fecha inválida';
    return parsed.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return 'Fecha inválida';
  }
}

/** ✅ Limpieza de texto para evitar comas, saltos de línea y caracteres raros */
private sanitizeText(text: any): string {
  if (!text) return '';
  return String(text)
    .replace(/(\r\n|\n|\r)/gm, ' ') // eliminar saltos de línea
    .replace(/;/g, ',')             // reemplazar ; para no romper columnas
    .trim();
}


}
