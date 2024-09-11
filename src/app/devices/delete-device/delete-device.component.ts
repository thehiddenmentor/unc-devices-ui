import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-device',
  standalone: true,
  imports: [],
  templateUrl: './delete-device.component.html',
  styleUrl: './delete-device.component.css',
})
export class DeleteDeviceComponent {
  @Output() delete = new EventEmitter<void>();
  @Input() id!: number;

  onDelete() {
    this.delete.emit();
  }
}
