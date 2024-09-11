import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.css',
})
export class DeleteUserComponent {
  @Output() delete = new EventEmitter<void>();
  @Input() id!: number;

  onDelete() {
    this.delete.emit();
  }
}
