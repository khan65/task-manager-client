import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Modal } from '../../core/ui/modal/modal';
import { StakeholdersService } from '../stakeholders/stakeholders.service';
import { Stakeholder, Product } from '../stakeholders/stakeholders.models';
import { OrdersService, OrderItemPayload } from './orders.service';
import { Order, OrderType } from './orders.models';

type Tab = 'orders' | 'order-types';

const STATUSES: Order['status'][] = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'];

@Component({
  selector: 'app-orders',
  imports: [FormsModule, DatePipe, DecimalPipe, Modal],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  readonly activeTab = signal<Tab>('orders');
  readonly showAddModal = signal(false);
  readonly statuses = STATUSES;

  readonly orders = signal<Order[]>([]);
  readonly orderTypes = signal<OrderType[]>([]);
  readonly stakeholders = signal<Stakeholder[]>([]);
  readonly products = signal<Product[]>([]);
  readonly errorMessage = signal<string | null>(null);

  newOrderStakeholderId = '';
  newOrderTypeId = '';
  newOrderDate = '';
  newOrderStatus: Order['status'] = 'Pending';
  newOrderNotes = '';
  newOrderItems: OrderItemPayload[] = [{ productId: '', quantity: 1, unitPrice: 0 }];

  newTypeName = '';
  newTypeDescription = '';

  constructor(
    private readonly ordersService: OrdersService,
    private readonly stakeholdersService: StakeholdersService,
    protected readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.reloadOrders();
    this.ordersService.getOrderTypes().subscribe((v) => this.orderTypes.set(v));
    this.stakeholdersService.getStakeholders().subscribe((v) => this.stakeholders.set(v));
    this.stakeholdersService.getProducts().subscribe((v) => this.products.set(v));
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  get addModalTitle(): string {
    return this.activeTab() === 'orders' ? 'New Order' : 'Add Order Type';
  }

  reloadOrders(): void {
    this.ordersService.getOrders().subscribe((v) => this.orders.set(v));
  }

  addItemRow(): void {
    this.newOrderItems.push({ productId: '', quantity: 1, unitPrice: 0 });
  }

  removeItemRow(index: number): void {
    if (this.newOrderItems.length <= 1) return;
    this.newOrderItems.splice(index, 1);
  }

  addOrder(): void {
    const items = this.newOrderItems.filter((i) => i.productId);
    if (!this.newOrderStakeholderId || !this.newOrderTypeId || !this.newOrderDate || items.length === 0) {
      this.errorMessage.set('Stakeholder, order type, date, and at least one product line are required.');
      return;
    }
    this.ordersService
      .createOrder({
        stakeholderId: this.newOrderStakeholderId,
        orderTypeId: this.newOrderTypeId,
        orderDate: new Date(this.newOrderDate).toISOString(),
        status: this.newOrderStatus,
        notes: this.newOrderNotes,
        items,
      })
      .subscribe({
        next: (order) => {
          this.orders.update((list) => [order, ...list]);
          this.newOrderStakeholderId = '';
          this.newOrderTypeId = '';
          this.newOrderDate = '';
          this.newOrderStatus = 'Pending';
          this.newOrderNotes = '';
          this.newOrderItems = [{ productId: '', quantity: 1, unitPrice: 0 }];
          this.showAddModal.set(false);
        },
        error: () => this.errorMessage.set('Could not create order — check the fields and try again.'),
      });
  }

  changeStatus(order: Order, status: Order['status']): void {
    this.ordersService
      .updateOrder(order.id, {
        stakeholderId: order.stakeholderId,
        orderTypeId: order.orderTypeId,
        orderDate: order.orderDate,
        status,
        notes: order.notes,
        items: order.items.map((i) => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice })),
      })
      .subscribe({
        next: (updated) => this.orders.update((list) => list.map((o) => (o.id === updated.id ? updated : o))),
        error: () => this.errorMessage.set('Could not update order status.'),
      });
  }

  removeOrder(order: Order): void {
    this.ordersService.deleteOrder(order.id).subscribe(() =>
      this.orders.update((list) => list.filter((o) => o.id !== order.id)),
    );
  }

  addOrderType(): void {
    this.ordersService.createOrderType(this.newTypeName, this.newTypeDescription).subscribe({
      next: (t) => {
        this.orderTypes.update((list) => [...list, t]);
        this.newTypeName = '';
        this.newTypeDescription = '';
        this.showAddModal.set(false);
      },
      error: () => this.errorMessage.set('Could not create order type.'),
    });
  }

  removeOrderType(id: string): void {
    this.ordersService.deleteOrderType(id).subscribe(() =>
      this.orderTypes.update((list) => list.filter((t) => t.id !== id)),
    );
  }
}
