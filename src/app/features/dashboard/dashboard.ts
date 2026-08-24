import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DashboardService } from './dashboard.service';
import { DashboardSummary } from './dashboard.models';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  readonly summary = signal<DashboardSummary | null>(null);

  constructor(
    protected readonly auth: AuthService,
    private readonly dashboardService: DashboardService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe((s) => this.summary.set(s));
  }

  maxStateCount(): number {
    const s = this.summary();
    if (!s || s.tasksByState.length === 0) return 1;
    return Math.max(1, ...s.tasksByState.map((t) => t.count));
  }

  signOut(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
