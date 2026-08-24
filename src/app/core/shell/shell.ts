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
  // Setup / Employee / Stakeholder / Product / Login History / Reports join this bar
  // once their modules land (Phase 10 in the blueprint) — Clients stands in for
  // Stakeholder and Org Structure for Setup until then.
  readonly navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/projects', label: 'Projects' },
    { path: '/clients', label: 'Clients' },
    { path: '/org-structure', label: 'Org Structure' },
    { path: '/users', label: 'Users' },
  ];

  menuOpen = false;

  constructor(
    protected readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  closeMenuSoon(): void {
    // let a click on a dropdown item register before the blur closes it
    setTimeout(() => (this.menuOpen = false), 150);
  }

  signOut(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
