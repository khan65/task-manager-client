import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Modal } from '../../core/ui/modal/modal';
import { StakeholdersService } from './stakeholders.service';
import { StakeholderCategory, Stakeholder, Contact, ContactGroup, Product } from './stakeholders.models';

type Tab = 'categories' | 'products' | 'contact-groups' | 'stakeholders' | 'contacts';

const TAB_LABELS: Record<Tab, string> = {
  stakeholders: 'Stakeholder',
  contacts: 'Contact',
  categories: 'Category',
  products: 'Product',
  'contact-groups': 'Contact Group',
};

@Component({
  selector: 'app-stakeholders',
  imports: [FormsModule, Modal],
  templateUrl: './stakeholders.html',
  styleUrl: './stakeholders.css',
})
export class Stakeholders implements OnInit {
  readonly activeTab = signal<Tab>('stakeholders');
  readonly showAddModal = signal(false);

  readonly categories = signal<StakeholderCategory[]>([]);
  readonly products = signal<Product[]>([]);
  readonly contactGroups = signal<ContactGroup[]>([]);
  readonly stakeholders = signal<Stakeholder[]>([]);
  readonly contacts = signal<Contact[]>([]);
  readonly errorMessage = signal<string | null>(null);

  newCategoryName = '';
  newCategoryDescription = '';
  newProductName = '';
  newProductDescription = '';
  newGroupName = '';
  newGroupDescription = '';
  newStakeholderName = '';
  newStakeholderDescription = '';
  newStakeholderCategoryId = '';
  newContactName = '';
  newContactEmail = '';
  newContactPhone = '';
  newContactStakeholderId = '';
  newContactGroupId = '';

  constructor(
    private readonly stakeholdersService: StakeholdersService,
    protected readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.reloadAll();
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  get addModalTitle(): string {
    return `Add ${TAB_LABELS[this.activeTab()]}`;
  }

  reloadAll(): void {
    this.stakeholdersService.getStakeholderCategories().subscribe((v) => this.categories.set(v));
    this.stakeholdersService.getProducts().subscribe((v) => this.products.set(v));
    this.stakeholdersService.getContactGroups().subscribe((v) => this.contactGroups.set(v));
    this.stakeholdersService.getStakeholders().subscribe((v) => this.stakeholders.set(v));
    this.stakeholdersService.getContacts().subscribe((v) => this.contacts.set(v));
  }

  addCategory(): void {
    this.stakeholdersService.createStakeholderCategory(this.newCategoryName, this.newCategoryDescription).subscribe({
      next: (c) => {
        this.categories.update((list) => [...list, c]);
        this.newCategoryName = '';
        this.newCategoryDescription = '';
        this.showAddModal.set(false);
      },
      error: () => this.errorMessage.set('Could not create stakeholder category.'),
    });
  }
  removeCategory(id: string): void {
    this.stakeholdersService.deleteStakeholderCategory(id).subscribe(() =>
      this.categories.update((list) => list.filter((c) => c.id !== id)),
    );
  }

  addProduct(): void {
    this.stakeholdersService.createProduct(this.newProductName, this.newProductDescription).subscribe({
      next: (p) => {
        this.products.update((list) => [...list, p]);
        this.newProductName = '';
        this.newProductDescription = '';
        this.showAddModal.set(false);
      },
      error: () => this.errorMessage.set('Could not create product.'),
    });
  }
  removeProduct(id: string): void {
    this.stakeholdersService.deleteProduct(id).subscribe(() =>
      this.products.update((list) => list.filter((p) => p.id !== id)),
    );
  }

  addContactGroup(): void {
    this.stakeholdersService.createContactGroup(this.newGroupName, this.newGroupDescription).subscribe({
      next: (g) => {
        this.contactGroups.update((list) => [...list, g]);
        this.newGroupName = '';
        this.newGroupDescription = '';
        this.showAddModal.set(false);
      },
      error: () => this.errorMessage.set('Could not create contact group.'),
    });
  }
  removeContactGroup(id: string): void {
    this.stakeholdersService.deleteContactGroup(id).subscribe(() =>
      this.contactGroups.update((list) => list.filter((g) => g.id !== id)),
    );
  }

  addStakeholder(): void {
    if (!this.newStakeholderCategoryId) {
      this.errorMessage.set('Pick a stakeholder category first.');
      return;
    }
    this.stakeholdersService.createStakeholder(this.newStakeholderName, this.newStakeholderDescription, this.newStakeholderCategoryId).subscribe({
      next: (c) => {
        this.stakeholders.update((list) => [...list, c]);
        this.newStakeholderName = '';
        this.newStakeholderDescription = '';
        this.showAddModal.set(false);
      },
      error: () => this.errorMessage.set('Could not create stakeholder.'),
    });
  }
  removeStakeholder(id: string): void {
    this.stakeholdersService.deleteStakeholder(id).subscribe(() =>
      this.stakeholders.update((list) => list.filter((c) => c.id !== id)),
    );
  }

  hasProduct(stakeholder: Stakeholder, productName: string): boolean {
    return stakeholder.products.includes(productName);
  }

  toggleProduct(stakeholder: Stakeholder, product: Product): void {
    const action = this.hasProduct(stakeholder, product.name)
      ? this.stakeholdersService.removeProduct(stakeholder.id, product.id)
      : this.stakeholdersService.assignProduct(stakeholder.id, product.id);

    action.subscribe({
      next: (updated) => this.stakeholders.update((list) => list.map((c) => (c.id === updated.id ? updated : c))),
      error: () => this.errorMessage.set('Could not update product association.'),
    });
  }

  addContact(): void {
    if (!this.newContactStakeholderId) {
      this.errorMessage.set('Pick a stakeholder first.');
      return;
    }
    this.stakeholdersService
      .createContact(
        this.newContactName,
        this.newContactEmail,
        this.newContactPhone,
        this.newContactStakeholderId,
        this.newContactGroupId || null,
      )
      .subscribe({
        next: (contact) => {
          this.contacts.update((list) => [...list, contact]);
          this.newContactName = '';
          this.newContactEmail = '';
          this.newContactPhone = '';
          this.showAddModal.set(false);
        },
        error: () => this.errorMessage.set('Could not create contact.'),
      });
  }
  removeContact(id: string): void {
    this.stakeholdersService.deleteContact(id).subscribe(() =>
      this.contacts.update((list) => list.filter((c) => c.id !== id)),
    );
  }
}
