import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',

})
export class ToastComponent {

  message = signal('');
  visible = signal(false);

  show(msg: string, timeout = 2500): void {
    this.message.set(msg);
    this.visible.set(true);

    setTimeout(() => this.visible.set(false), timeout);
  }
}
