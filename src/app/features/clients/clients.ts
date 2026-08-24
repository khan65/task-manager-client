import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { ClientsService } from './clients.service';
import { ClientCategory, ClientRecord, Contact, ContactGroup, Product } from './clients.models';

type Tab = 'categories' | 'products' | 'contact-groups' | 'clients' | 'contacts';

@Component({
  selector: 'app-clients',
  imports: [FormsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {
  readonly activeTab = signal<Tab>('clients');

  readonly categories = signal<ClientCategory[]>([]);
  readonly products = signal<Product[]>([]);
  readonly contactGroups = signal<ContactGroup[]>([]);
  readonly clients = signal<ClientRecord[]>([]);
  readonly contacts = signal<Contact[]>([]);
  readonly errorMessage = signal<string | null>(null);

  newCategoryName = '';
  newCategoryDescription = '';
  newProductName = '';
  newProductDescription = '';
  newGroupName = '';
  newGroupDescription = '';
  newClientName = '';
  newClientDescription = '';
  newClientCategoryId = '';
  newContactName = '';
  newContactEmail = '';
  newContactPhone = '';
  newContactClientId = '';
  newContactGroupId = '';

  constructor(
    private readonly clientsService: ClientsService,
    protected readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.reloadAll();
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  reloadAll(): void {
    this.clientsService.getClientCategories().subscribe((v) => this.categories.set(v));
    this.clientsService.getProducts().subscribe((v) => this.products.set(v));
    this.clientsService.getContactGroups().subscribe((v) => this.contactGroups.set(v));
    this.clientsService.getClients().subscribe((v) => this.clients.set(v));
    this.clientsService.getContacts().subscribe((v) => this.contacts.set(v));
  }

  addCategory(): void {
    this.clientsService.createClientCategory(this.newCategoryName, this.newCategoryDescription).subscribe({
      next: (c) => {
        this.categories.update((list) => [...list, c]);
        this.newCategoryName = '';
        this.newCategoryDescription = '';
      },
      error: () => this.errorMessage.set('Could not create client category.'),
    });
  }
  removeCategory(id: string): void {
    this.clientsService.deleteClientCategory(id).subscribe(() =>
      this.categories.update((list) => list.filter((c) => c.id !== id)),
    );
  }

  addProduct(): void {
    this.clientsService.createProduct(this.newProductName, this.newProductDescription).subscribe({
      next: (p) => {
        this.products.update((list) => [...list, p]);
        this.newProductName = '';
        this.newProductDescription = '';
      },
      error: () => this.errorMessage.set('Could not create product.'),
    });
  }
  removeProduct(id: string): void {
    this.clientsService.deleteProduct(id).subscribe(() =>
      this.products.update((list) => list.filter((p) => p.id !== id)),
    );
  }

  addContactGroup(): void {
    this.clientsService.createContactGroup(this.newGroupName, this.newGroupDescription).subscribe({
      next: (g) => {
        this.contactGroups.update((list) => [...list, g]);
        this.newGroupName = '';
        this.newGroupDescription = '';
      },
      error: () => this.errorMessage.set('Could not create contact group.'),
    });
  }
  removeContactGroup(id: string): void {
    this.clientsService.deleteContactGroup(id).subscribe(() =>
      this.contactGroups.update((list) => list.filter((g) => g.id !== id)),
    );
  }

  addClient(): void {
    if (!this.newClientCategoryId) {
      this.errorMessage.set('Pick a client category first.');
      return;
    }
    this.clientsService.createClient(this.newClientName, this.newClientDescription, this.newClientCategoryId).subscribe({
      next: (c) => {
        this.clients.update((list) => [...list, c]);
        this.newClientName = '';
        this.newClientDescription = '';
      },
      error: () => this.errorMessage.set('Could not create client.'),
    });
  }
  removeClient(id: string): void {
    this.clientsService.deleteClient(id).subscribe(() =>
      this.clients.update((list) => list.filter((c) => c.id !== id)),
    );
  }

  hasProduct(client: ClientRecord, productName: string): boolean {
    return client.products.includes(productName);
  }

  toggleProduct(client: ClientRecord, product: Product): void {
    const action = this.hasProduct(client, product.name)
      ? this.clientsService.removeProduct(client.id, product.id)
      : this.clientsService.assignProduct(client.id, product.id);

    action.subscribe({
      next: (updated) => this.clients.update((list) => list.map((c) => (c.id === updated.id ? updated : c))),
      error: () => this.errorMessage.set('Could not update product association.'),
    });
  }

  addContact(): void {
    if (!this.newContactClientId) {
      this.errorMessage.set('Pick a client first.');
      return;
    }
    this.clientsService
      .createContact(
        this.newContactName,
        this.newContactEmail,
        this.newContactPhone,
        this.newContactClientId,
        this.newContactGroupId || null,
      )
      .subscribe({
        next: (contact) => {
          this.contacts.update((list) => [...list, contact]);
          this.newContactName = '';
          this.newContactEmail = '';
          this.newContactPhone = '';
        },
        error: () => this.errorMessage.set('Could not create contact.'),
      });
  }
  removeContact(id: string): void {
    this.clientsService.deleteContact(id).subscribe(() =>
      this.contacts.update((list) => list.filter((c) => c.id !== id)),
    );
  }
}
