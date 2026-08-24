import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientCategory, ClientRecord, Contact, ContactGroup, Product } from './clients.models';

const base = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class ClientsService {
  constructor(private readonly http: HttpClient) {}

  // Client categories
  getClientCategories(): Observable<ClientCategory[]> {
    return this.http.get<ClientCategory[]>(`${base}/client-categories`);
  }
  createClientCategory(name: string, description: string): Observable<ClientCategory> {
    return this.http.post<ClientCategory>(`${base}/client-categories`, { name, description });
  }
  deleteClientCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/client-categories/${id}`);
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

  // Clients
  getClients(): Observable<ClientRecord[]> {
    return this.http.get<ClientRecord[]>(`${base}/clients`);
  }
  createClient(name: string, description: string, clientCategoryId: string): Observable<ClientRecord> {
    return this.http.post<ClientRecord>(`${base}/clients`, { name, description, clientCategoryId });
  }
  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/clients/${id}`);
  }
  assignProduct(clientId: string, productId: string): Observable<ClientRecord> {
    return this.http.post<ClientRecord>(`${base}/clients/${clientId}/products`, { productId });
  }
  removeProduct(clientId: string, productId: string): Observable<ClientRecord> {
    return this.http.delete<ClientRecord>(`${base}/clients/${clientId}/products/${productId}`);
  }

  // Contacts
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${base}/contacts`);
  }
  createContact(fullName: string, email: string, phone: string, clientId: string, contactGroupId: string | null): Observable<Contact> {
    return this.http.post<Contact>(`${base}/contacts`, { fullName, email, phone, clientId, contactGroupId });
  }
  deleteContact(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/contacts/${id}`);
  }
}
