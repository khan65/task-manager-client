import { Component, OnInit, computed, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DashboardService } from './dashboard.service';
import { DashboardSummary } from './dashboard.models';

interface DonutSegment {
  stateName: string;
  count: number;
  color: string;
  dashArray: string;
  dashOffset: number;
}

const STATE_COLORS: Record<string, string> = {
  'To Do': 'var(--state-todo)',
  'In Progress': 'var(--state-inprogress)',
  'In Review': 'var(--state-inreview)',
  Done: 'var(--state-done)',
};

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  readonly summary = signal<DashboardSummary | null>(null);
  readonly circumference = CIRCUMFERENCE;
  readonly radius = RADIUS;

  readonly donutSegments = computed<DonutSegment[]>(() => {
    const s = this.summary();
    if (!s) return [];
    const total = s.totalTasks || 1;
    let offsetSoFar = 0;

    return s.tasksByState.map((state) => {
      const fraction = state.count / total;
      const dash = fraction * CIRCUMFERENCE;
      const segment: DonutSegment = {
        stateName: state.stateName,
        count: state.count,
        color: STATE_COLORS[state.stateName] ?? 'var(--color-text-faint)',
        dashArray: `${dash} ${CIRCUMFERENCE - dash}`,
        dashOffset: -offsetSoFar,
      };
      offsetSoFar += dash;
      return segment;
    });
  });

  readonly activeProjectRatio = computed(() => {
    const s = this.summary();
    if (!s || s.totalProjects === 0) return 0;
    return s.activeProjects / s.totalProjects;
  });

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe((s) => this.summary.set(s));
  }

  stateBadgeClass(stateName: string): string {
    const key = stateName.toLowerCase().replace(/\s+/g, '');
    return `state-${key}-badge`;
  }
}
