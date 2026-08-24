export interface ClientCategory {
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

export interface ClientRecord {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  clientCategoryId: string;
  clientCategoryName: string;
  products: string[];
}

export interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  clientId: string;
  clientName: string;
  contactGroupId: string | null;
  contactGroupName: string | null;
}
