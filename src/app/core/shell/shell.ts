import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  readonly navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'M3 13h4v7H3zM10 4h4v16h-4zM17 9h4v11h-4z' },
    { path: '/tasks', label: 'Tasks', icon: 'M4 6h16M4 12h16M4 18h10' },
    { path: '/projects', label: 'Projects', icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
    { path: '/clients', label: 'Clients', icon: 'M16 11a4 4 0 1 0-4-4M8 11a4 4 0 1 1 4-4M2 21v-1a6 6 0 0 1 12 0v1M14 13a6 6 0 0 1 8 6v2' },
    { path: '/org-structure', label: 'Org Structure', icon: 'M3 21h18M6 21V9l6-6 6 6v12M9 21v-6h6v6' },
    { path: '/users', label: 'Users', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  ];

  constructor(
    protected readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  signOut(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
