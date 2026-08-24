import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { LoginHistoryService } from './login-history.service';
import { LoginHistoryEntry } from './login-history.models';

@Component({
  selector: 'app-login-history',
  imports: [DatePipe],
  templateUrl: './login-history.html',
  styleUrl: './login-history.css',
})
export class LoginHistory implements OnInit {
  readonly entries = signal<LoginHistoryEntry[]>([]);
  readonly loaded = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor(
    private readonly loginHistoryService: LoginHistoryService,
    protected readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    if (!this.auth.isAdmin()) return;
    this.loginHistoryService.getLoginHistory().subscribe({
      next: (v) => {
        this.entries.set(v);
        this.loaded.set(true);
      },
      error: () => this.errorMessage.set('Could not load login history.'),
    });
  }
}
