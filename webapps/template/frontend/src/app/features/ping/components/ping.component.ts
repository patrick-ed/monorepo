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
  pingResponse = signal<string>('No response yet');
  buttonDisabled = signal<boolean>(false);

  private BUTTON_DELAY_MS = 5000;

  sendPing() {
    console.log('Ping sent to the backend');
    this.apiService.pingBackend().subscribe({
      next: (response) => {
        this.handleSuccess(response)
        this.buttonDisabled.set(true);
        setTimeout(() => this.buttonDisabled.set(false), this.BUTTON_DELAY_MS);
      },
      error: (error) => {
        this.handleError(error)
      }
    });
  }

  private handleSuccess(response: string) {
    console.log('Response from backend:', response);
    this.pingResponse.set(response);
  }

  private handleError(error: any) {
    console.error('Error pinging backend:', error);
    this.pingResponse.set('Error pinging backend');
  }

}
