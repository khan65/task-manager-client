import { Component, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface NavItem {
  path: string;
  label: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  // Setup / Product / Reports join this bar once their modules land — Org Structure
  // stands in for Setup until then. Login History is admin-only, matching its
  // Admin-gated API endpoint (it's an audit list, not something every Member should see).
  private readonly allNavItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/projects', label: 'Projects' },
    { path: '/stakeholders', label: 'Stakeholders' },
    { path: '/employees', label: 'Employees' },
    { path: '/org-structure', label: 'Org Structure' },
    { path: '/users', label: 'Users' },
    { path: '/login-history', label: 'Login History', adminOnly: true },
  ];

  readonly navItems = computed(() =>
    this.allNavItems.filter((item) => !item.adminOnly || this.auth.isAdmin()),
  );

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
