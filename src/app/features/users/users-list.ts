import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { UsersService } from './users.service';
import { RoleSummary, UserSummary } from './users.models';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-users-list',
  imports: [FormsModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersList implements OnInit {
  readonly users = signal<UserSummary[]>([]);
  readonly roles = signal<RoleSummary[]>([]);
  readonly errorMessage = signal<string | null>(null);

  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly totalCount = signal(0);
  searchTerm = '';

  constructor(
    private readonly usersService: UsersService,
    protected readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.reload();
    this.usersService.getRoles().subscribe((roles) => this.roles.set(roles));
  }

  reload(): void {
    this.usersService.getUsersPaged(this.page(), PAGE_SIZE, this.searchTerm || undefined).subscribe({
      next: (result) => {
        this.users.set(result.items);
        this.totalPages.set(result.totalPages);
        this.totalCount.set(result.totalCount);
      },
      error: () => this.errorMessage.set('Could not load users.'),
    });
  }

  search(): void {
    this.page.set(1);
    this.reload();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.page.set(page);
    this.reload();
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
