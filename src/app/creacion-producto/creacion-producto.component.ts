import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../interface/product.model';
import { ProductService } from '../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-creacion-producto',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './creacion-producto.component.html',
  styleUrls: ['./creacion-producto.component.css'],
})
export class CreacionProductoComponent implements OnInit {
  productos: Product[] = [];
  nuevoProducto: Product = this.resetProducto();

  filtro: string = ''; 
  editIndex: number | null = null;
  imagenProducto: File | null = null;

  modalAbierto = false;
  isLoading = false;
  errorMessage: string | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  // 🧩 Reinicia el modelo base del producto
  private resetProducto(): Product {
    return {
      name: '',
      quantity: 0,
      unitOfMeasurement: '',
      category: '',
      imageUrl: ''
    };
  }

  // 🧩 Cargar productos desde el servicio
  cargarProductos() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (productos) => {
        this.productos = productos || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;

        // ⚠️ Si la API devuelve vacío o no hay datos, solo mostramos mensaje en consola
        if (error.status === 404 || error.status === 0 || error.status === 500) {
          this.productos = [];
          console.warn('⚠️ No se encontraron productos todavía.');
          return;
        }

        // ⚠️ Solo mostrar alerta en errores reales
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar productos',
          text: 'Ocurrió un problema inesperado al obtener los productos.',
          confirmButtonColor: '#2162a7'
        });
        console.error('Error al cargar productos:', error);
      }
    });
  }

  // 🧩 Abrir modal (crear o editar)
  abrirModal(producto?: Product) {
    if (producto) {
      this.nuevoProducto = { ...producto };
      this.editIndex = this.productos.findIndex(p => p.idproduct === producto.idproduct);
    } else {
      this.nuevoProducto = this.resetProducto();
      this.editIndex = null;
    }
    this.modalAbierto = true;
    this.imagenProducto = null;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.resetForm();
  }

  private resetForm() {
    this.nuevoProducto = this.resetProducto();
    this.editIndex = null;
    this.imagenProducto = null;
  }

  // 🧩 Paginación y filtros
  get productosFiltrados(): Product[] {
    if (!this.filtro.trim()) {
      return this.productos;
    }
    return this.productos.filter((producto) =>
      producto.name.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

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

  // 🧩 Subir imagen al servidor
  private subirImagen(id?: number): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.imagenProducto && id) {
        this.productService.uploadImage(this.imagenProducto, id).subscribe({
          next: (response) => resolve(response.imageUrl || ''),
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al subir imagen',
              text: 'No se pudo subir la imagen del producto.',
              confirmButtonColor: '#d33'
            });
            reject(error);
          }
        });
      } else {
        resolve('');
      }
    });
  }

  // 🧩 Guardar (crear o actualizar producto)
  async guardarProducto() {
    if (!this.validateProducto()) return;

    this.isLoading = true;
    const fechaActual = new Date();

    if (this.editIndex !== null && this.nuevoProducto.idproduct) {
      // 🔹 Actualizar producto existente
      this.nuevoProducto.updateDate = fechaActual;
      this.productService.updateProduct(this.nuevoProducto.idproduct, this.nuevoProducto).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Producto actualizado',
            text: 'El producto se actualizó correctamente.',
            showConfirmButton: false,
            timer: 1500,
            background: '#f4f7fc'
          });
          this.cargarProductos();
          this.cerrarModal();
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: 'No se pudo actualizar el producto.',
            confirmButtonColor: '#d33'
          });
          console.error('Error al actualizar producto', error);
        }
      });
    } else {
      // 🔹 Crear nuevo producto
      this.nuevoProducto.creationDate = fechaActual;
      this.productService.createProduct(this.nuevoProducto).subscribe({
        next: async (product) => {
          await this.subirImagen(product.idproduct);
          Swal.fire({
            icon: 'success',
            title: 'Producto creado',
            text: 'El producto fue registrado exitosamente.',
            showConfirmButton: false,
            timer: 1500,
            background: '#f4f7fc'
          });
          this.cargarProductos();
          this.cerrarModal();
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error al crear',
            text: 'No se pudo crear el producto. Intente nuevamente.',
            confirmButtonColor: '#d33'
          });
          console.error('Error al crear producto', error);
        }
      });
    }
  }

  // 🧩 Validaciones de campos
  private validateProducto(): boolean {
    if (!this.nuevoProducto.name?.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El nombre del producto es obligatorio.',
        confirmButtonColor: '#2162a7'
      });
      return false;
    }

    if (!this.nuevoProducto.category?.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor selecciona una categoría.',
        confirmButtonColor: '#2162a7'
      });
      return false;
    }

    return true;
  }

  // 🧩 Editar producto existente
  editarProducto(producto: Product) {
    this.abrirModal(producto);
  }

  // 🧩 Eliminar producto con confirmación
  eliminarProducto(producto: Product) {
    if (!producto.idproduct) return;

    Swal.fire({
      title: '¿Eliminar producto?',
      text: `¿Deseas eliminar "${producto.name}" del sistema?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#2162a7'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!producto.idproduct) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El producto seleccionado no tiene un ID válido.',
            confirmButtonColor: '#d33'
          });
          return;
        }

        this.isLoading = true;
        this.productService.deleteProduct(producto.idproduct!).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El producto fue eliminado correctamente.',
              showConfirmButton: false,
              timer: 1200
            });
            this.cargarProductos();
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: 'No se pudo eliminar el producto.',
              confirmButtonColor: '#d33'
            });
            console.error('Error al eliminar producto', error);
          }
        });
      }
    });
  }

  // 🧩 Seleccionar imagen con validación
  seleccionarImagen(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'warning',
          title: 'Formato no permitido',
          text: 'Solo se permiten imágenes (JPEG, PNG o GIF).',
          confirmButtonColor: '#2162a7'
        });
        return;
      }

      if (file.size > maxSize) {
        Swal.fire({
          icon: 'warning',
          title: 'Archivo muy grande',
          text: 'La imagen no debe superar los 5MB.',
          confirmButtonColor: '#2162a7'
        });
        return;
      }

      this.imagenProducto = file;
    }
  }
}
