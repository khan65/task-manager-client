import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StakeholderCategory, Stakeholder, Contact, ContactGroup, Product } from './stakeholders.models';

const base = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class StakeholdersService {
  constructor(private readonly http: HttpClient) {}

  // Stakeholder categories
  getStakeholderCategories(): Observable<StakeholderCategory[]> {
    return this.http.get<StakeholderCategory[]>(`${base}/stakeholder-categories`);
  }
  createStakeholderCategory(name: string, description: string): Observable<StakeholderCategory> {
    return this.http.post<StakeholderCategory>(`${base}/stakeholder-categories`, { name, description });
  }
  deleteStakeholderCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/stakeholder-categories/${id}`);
  }

  // Contact groups
  getContactGroups(): Observable<ContactGroup[]> {
    return this.http.get<ContactGroup[]>(`${base}/contact-groups`);
  }
  createContactGroup(name: string, description: string): Observable<ContactGroup> {
    return this.http.post<ContactGroup>(`${base}/contact-groups`, { name, description });
  }
  deleteContactGroup(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/contact-groups/${id}`);
  }

  // Products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${base}/products`);
  }
  createProduct(name: string, description: string): Observable<Product> {
    return this.http.post<Product>(`${base}/products`, { name, description });
  }
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/products/${id}`);
  }

  // Stakeholders
  getStakeholders(): Observable<Stakeholder[]> {
    return this.http.get<Stakeholder[]>(`${base}/stakeholders`);
  }
  createStakeholder(name: string, description: string, stakeholderCategoryId: string): Observable<Stakeholder> {
    return this.http.post<Stakeholder>(`${base}/stakeholders`, { name, description, stakeholderCategoryId });
  }
  deleteStakeholder(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/stakeholders/${id}`);
  }
  assignProduct(stakeholderId: string, productId: string): Observable<Stakeholder> {
    return this.http.post<Stakeholder>(`${base}/stakeholders/${stakeholderId}/products`, { productId });
  }
  removeProduct(stakeholderId: string, productId: string): Observable<Stakeholder> {
    return this.http.delete<Stakeholder>(`${base}/stakeholders/${stakeholderId}/products/${productId}`);
  }

  // Contacts
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${base}/contacts`);
  }
  createContact(fullName: string, email: string, phone: string, stakeholderId: string, contactGroupId: string | null): Observable<Contact> {
    return this.http.post<Contact>(`${base}/contacts`, { fullName, email, phone, stakeholderId, contactGroupId });
  }
  deleteContact(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/contacts/${id}`);
  }
}
