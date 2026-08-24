export interface Organization {
  id: string;
  name: string;
  description: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  organizationName: string;
}

export interface Designation {
  id: string;
  title: string;
  description: string;
}

export interface Grade {
  id: string;
  name: string;
  level: number;
  description: string;
}
