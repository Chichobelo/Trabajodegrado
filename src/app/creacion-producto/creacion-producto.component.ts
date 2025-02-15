import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../interface/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-creacion-producto',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './creacion-producto.component.html',
  styleUrls: ['./creacion-producto.component.css'],
})
export class CreacionProductoComponent implements OnInit {
  // List of measurement units  
  // Arrays and main product properties
  productos: Product[] = [];
  nuevoProducto: Product = this.resetProducto();
  
  // Filtering and editing properties
  filtro: string = ''; 
  editIndex: number | null = null;
  imagenProducto: File | null = null;
  
  // Modal and UI state
  modalAbierto = false;
  isLoading = false;
  errorMessage: string | null = null;
  URL: any;

  currentPage: number = 1; // Página actual
  itemsPerPage: number = 5; // Número de productos por página

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.productosFiltrados.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.productosFiltrados.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  // Reset product to initial state
  private resetProducto(): Product {
    return {
      name: '',
      quantity: 0,
      unitOfMeasurement: '',
      category: '',
      imageUrl: ''
    };
  }

  // Load all products
  cargarProductos() {
    this.isLoading = true;
    this.errorMessage = null;

    this.productService.getAllProducts().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'No se pudieron cargar los productos. Intente nuevamente.';
        this.isLoading = false;
        console.error('Error al cargar productos', error);
      }
    });
  }

  // Open modal for new/edit product
  abrirModal(producto?: Product) {
    if (producto) {
      // Edit existing product
      this.nuevoProducto = { ...producto };
      this.editIndex = this.productos.findIndex(p => p.idproduct === producto.idproduct);
    } else {
      // New product
      this.nuevoProducto = this.resetProducto();
      this.editIndex = null;
    }

    this.modalAbierto = true;
    this.imagenProducto = null;
    this.errorMessage = null;
  }

  // Close modal
  cerrarModal() {
    this.modalAbierto = false;
    this.resetForm();
  }

  // Reset form state
  private resetForm() {
    this.nuevoProducto = this.resetProducto();
    this.editIndex = null;
    this.imagenProducto = null;
    this.errorMessage = null;
  }

  // Filtered products getter
  get productosFiltrados(): Product[] {
    if (!this.filtro.trim()) {
      return this.productos;
    }
    return this.productos.filter((producto) =>
      producto.name.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  private subirImagen(t: number | undefined): Promise<string> {
    console.log(t)
    return new Promise((resolve, reject) => {
      if (this.imagenProducto) {
        this.productService.uploadImage(this.imagenProducto, t).subscribe({
          next: (response) => {
            resolve(response.imageUrl != null ? response.imageUrl : "");
          },
          error: (error) => {
            console.error('Error al subir imagen', error);
            reject('No se pudo subir la imagen');
          }
        });
      } else {
        resolve(''); // No image selected
      }
    });
  }

  // Save product (create or update)
  async guardarProducto() {
    // Validate required fields
    console.log("fsfsdf")
    if (!this.validateProducto()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      // Upload image if selected

      const fechaActual = new Date();

      if (this.editIndex !== null && this.nuevoProducto.idproduct) {
        // Update existing product
        this.nuevoProducto.updateDate = fechaActual;
        this.productService.updateProduct(this.nuevoProducto.idproduct, this.nuevoProducto).subscribe({
          next: () => {
            this.cargarProductos();
            this.cerrarModal();
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage = 'No se pudo actualizar el producto. Intente nuevamente.';
            this.isLoading = false;
            console.error('Error al actualizar producto', error);
          }
        });
      } else {
        // Create new product
        this.nuevoProducto.creationDate = fechaActual;
        this.productService.createProduct(this.nuevoProducto).subscribe({
          next: (product) => {
            this.subirImagen(product.idproduct)
            this.cargarProductos();
            this.cerrarModal();
            this.isLoading = false;
          },
          error: (error) => {
            this.errorMessage = 'No se pudo crear el producto. Intente nuevamente.';
            this.isLoading = false;
            console.error('Error al crear producto', error);
          }
        });
      }
    } catch (error) {
      this.errorMessage = 'Ocurrió un error en el proceso de guardado.';
      this.isLoading = false;
      console.error('Error en el proceso de guardado', error);
    }
  }

  // Validate product details before save
  private validateProducto(): boolean {
    if (!this.nuevoProducto.name.trim()) {
      this.errorMessage = 'El nombre del producto es obligatorio';
      return false;
    }
    return true;
  }

  // Edit product
  editarProducto(producto: Product) {
    this.abrirModal(producto);
  }

  // Delete product
  eliminarProducto(producto: Product) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?') && producto.idproduct) {
      this.isLoading = true;
      this.errorMessage = null;

      this.productService.deleteProduct(producto.idproduct).subscribe({
        next: () => {
          this.cargarProductos();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'No se pudo eliminar el producto. Intente nuevamente.';
          this.isLoading = false;
          console.error('Error al eliminar producto', error);
        }
      });
    }
  }



  

  // Image selection handler
  seleccionarImagen(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validate file type and size
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Solo se permiten imágenes (JPEG, PNG, GIF)';
        return;
      }

      if (file.size > maxSize) {
        this.errorMessage = 'La imagen no debe superar los 5MB';
        return;
      }

      this.imagenProducto = file;
      this.errorMessage = null;
    }
  }
}