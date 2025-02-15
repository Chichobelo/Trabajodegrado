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
      const matchesText = packing.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
                          packing.packagingTypeId.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesStartDate = !this.startDate || (packing.creationDate && new Date(packing.creationDate) >= new Date(this.startDate));
      const matchesEndDate = !this.endDate || (packing.creationDate && new Date(packing.creationDate) <= new Date(this.endDate));
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
}