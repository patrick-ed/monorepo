import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-ping',
  imports: [],
  templateUrl: './ping.component.html',
  styleUrl: './ping.component.scss'
})
export class PingComponent {

  private apiService = inject(ApiService);
  private pingResponse = signal<string>('No response yet');

  sendPing() {
    console.log('Ping sent to the backend');
    this.apiService.pingBackend().subscribe({
      next: (response) => {
        console.log('Response from backend:', response);
        this.pingResponse.set(response);
      },
      error: (error) => {
        console.error('Error pinging backend:', error);
        this.pingResponse.set('Error pinging backend');
      }
    });

  }
}
