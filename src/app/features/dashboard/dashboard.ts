import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  constructor(
    protected readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  signOut(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
