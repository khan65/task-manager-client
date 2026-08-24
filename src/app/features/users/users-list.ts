import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { UsersService } from './users.service';
import { RoleSummary, UserSummary } from './users.models';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersList implements OnInit {
  readonly users = signal<UserSummary[]>([]);
  readonly roles = signal<RoleSummary[]>([]);
  readonly errorMessage = signal<string | null>(null);

  constructor(
    private readonly usersService: UsersService,
    protected readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.reload();
    this.usersService.getRoles().subscribe((roles) => this.roles.set(roles));
  }

  reload(): void {
    this.usersService.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: () => this.errorMessage.set('Could not load users.'),
    });
  }

  hasRole(user: UserSummary, roleName: string): boolean {
    return user.roles.includes(roleName);
  }

  toggleRole(user: UserSummary, role: RoleSummary): void {
    const action = this.hasRole(user, role.name)
      ? this.usersService.removeRole(user.id, role.id)
      : this.usersService.assignRole(user.id, role.id);

    action.subscribe({
      next: (updated) => this.users.update((list) => list.map((u) => (u.id === updated.id ? updated : u))),
      error: () => this.errorMessage.set('Role change failed — you may need Admin access.'),
    });
  }
}
