export interface TaskStateCount {
  stateName: string;
  count: number;
}

export interface RecentActivity {
  taskId: string;
  taskTitle: string;
  fromStateName: string | null;
  toStateName: string;
  changedByUserName: string;
  changedAt: string;
}

export interface DashboardTaskSummary {
  id: string;
  title: string;
  projectName: string;
  taskStateName: string;
  dueDate: string | null;
  assigneeName: string | null;
}

export interface DashboardSummary {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  tasksByState: TaskStateCount[];
  totalStakeholders: number;
  totalUsers: number;
  myOpenTasks: DashboardTaskSummary[];
  upcomingDueTasks: DashboardTaskSummary[];
  recentActivity: RecentActivity[];
}
