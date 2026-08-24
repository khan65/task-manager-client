export type ProjectStatus = 'Planning' | 'Active' | 'OnHold' | 'Completed' | 'Cancelled';

export const PROJECT_STATUSES: ProjectStatus[] = ['Planning', 'Active', 'OnHold', 'Completed', 'Cancelled'];

export interface ProjectType {
  id: string;
  name: string;
  description: string;
}

export interface ProjectMember {
  userId: string;
  fullName: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: ProjectStatus;
  createdAt: string;
  stakeholderId: string;
  stakeholderName: string;
  projectTypeId: string;
  projectTypeName: string;
  departmentId: string | null;
  departmentName: string | null;
  members: ProjectMember[];
}
