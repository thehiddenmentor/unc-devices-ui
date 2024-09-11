import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-result',
  standalone: true,
  imports: [],
  templateUrl: './no-result.component.html',
  styleUrl: './no-result.component.css',
})
export class NoResultComponent {
  @Input() text = '';
}
