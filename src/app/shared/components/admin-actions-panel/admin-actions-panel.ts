import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Panel reutilizable para acciones de administración:
 * - Editar (toggle formulario)
 * - Eliminar (confirmación externa)
 *
 * Se usa en:
 * - ProductDetail
 * - CursoDetail
 * - TutorProfile
 */
@Component({
  selector: 'app-admin-actions-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-actions-panel.html',})
  
export class AdminActionsPanelComponent {

  /** Título del item (producto / curso / tutor) */
  @Input() title = '';

  /** Texto descriptivo (opcional) */
  @Input() subtitle = '';

  /** Control externo si el usuario es admin */
  @Input() isAdmin = false;

  /** Emite cuando se solicita editar */
  @Output() edit = new EventEmitter<void>();

  /** Emite cuando se solicita eliminar */
  @Output() delete = new EventEmitter<void>();

  /** Control interno del colapso */
  isOpen = signal(false);

  toggleEdit(): void {
    this.isOpen.update(v => !v);
    this.edit.emit();
  }

  onDelete(): void {
    const ok = confirm(
      `¿Eliminar "${this.title}"?\nEsta acción no se puede deshacer.`,
    );
    if (!ok) return;
    this.delete.emit();
  }
}
