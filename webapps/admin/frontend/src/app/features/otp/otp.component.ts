import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface OtpCredentials {
  otp?: string | null;
}

@Component({
  selector: 'app-otp',
  imports: [ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OtpComponent {
  @Output() formSubmit = new EventEmitter<OtpCredentials>();

  otpForm = new FormGroup({
    otp: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}')]),
  });

  onSubmit(): void {
    if (this.otpForm.valid) {
      this.formSubmit.emit(this.otpForm.value);
    } else {
      console.error('Auth form is invalid.');
    }
  }
}
