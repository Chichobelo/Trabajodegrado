import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Confirmar eliminación</h2>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar el componente "{{ itemName }}"?</p>
            <p class="text-muted">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="onCancel()">Cancelar</button>
            <button class="btn-delete" (click)="onConfirm()">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
/* Modal Base Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out forwards;
}

.modal-dialog {
  width: 90%;
  max-width: 400px;
  animation: modalSlideIn 0.3s ease-out forwards;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

/* Modal Header */
.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  text-align: center;
}

.modal-header h2 {
  color: #dc3545;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

/* Modal Body */
.modal-body {
  padding: 20px;
  text-align: center;
}

.modal-body p {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.text-muted {
  color: #666;
  font-size: 14px;
  margin-top: 8px;
  font-style: italic;
}

/* Modal Footer */
.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* Buttons */
.btn-cancel, .btn-delete {
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background-color: #5a6268;
  transform: scale(1.05);
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
  transform: scale(1.05);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .modal-dialog {
    width: 95%;
    margin: 10px;
  }
  
  .modal-footer {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn-cancel, .btn-delete {
    width: 100%;
  }
}
  `]
})
export class DeleteConfirmationModalComponent {
  @Input() show = false;
  @Input() itemName = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}