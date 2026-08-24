export interface StakeholderCategory {
  id: string;
  name: string;
  description: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  stakeholderCategoryId: string;
  stakeholderCategoryName: string;
  products: string[];
}

export interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  stakeholderId: string;
  stakeholderName: string;
  contactGroupId: string | null;
  contactGroupName: string | null;
}
