export interface UserSummary {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  roles: string[];
}

export interface RoleSummary {
  id: string;
  name: string;
  description: string;
}
