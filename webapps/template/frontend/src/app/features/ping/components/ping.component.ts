import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ping',
  imports: [CommonModule],
  templateUrl: './ping.component.html',
  styleUrl: './ping.component.scss'
})
export class PingComponent {

  private apiService = inject(ApiService);
  buttonDisabled = signal<boolean>(false);
  timeLeft = signal<number>(0);
  localClicks = signal<number>(0);

  private BUTTON_DELAY_MS = 2000;

  sendPing() {
    console.log('Ping sent');
    this.apiService.pingBackend().subscribe({
      next: (response) => {
        this.handleSuccess(response)
      },
      error: (error) => {
        this.handleError(error)
      }
    });
  }

  startCountdown() {
    this.timeLeft.set(this.BUTTON_DELAY_MS / 1000);
    const interval = setInterval(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.set(this.timeLeft() - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  private handleSuccess(response: string) {
    console.log('Server Response:', response);

    this.startCountdown();
    this.buttonDisabled.set(true);
    this.localClicks.set(this.localClicks() + 1);

    setTimeout(() => this.buttonDisabled.set(false), this.BUTTON_DELAY_MS);
  }

  private handleError(error: any) {
    console.error('Server Error:', error);
  }
}
