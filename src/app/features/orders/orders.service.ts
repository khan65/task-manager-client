import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, OrderType } from './orders.models';

const base = environment.apiBaseUrl;

export interface OrderItemPayload {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface UpsertOrderPayload {
  stakeholderId: string;
  orderTypeId: string;
  orderDate: string;
  status: string;
  notes: string;
  items: OrderItemPayload[];
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private readonly http: HttpClient) {}

  getOrderTypes(): Observable<OrderType[]> {
    return this.http.get<OrderType[]>(`${base}/order-types`);
  }
  createOrderType(name: string, description: string): Observable<OrderType> {
    return this.http.post<OrderType>(`${base}/order-types`, { name, description });
  }
  deleteOrderType(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/order-types/${id}`);
  }

  getOrders(stakeholderId?: string): Observable<Order[]> {
    const params: Record<string, string> = stakeholderId ? { stakeholderId } : {};
    return this.http.get<Order[]>(`${base}/orders`, { params });
  }
  createOrder(payload: UpsertOrderPayload): Observable<Order> {
    return this.http.post<Order>(`${base}/orders`, payload);
  }
  updateOrder(id: string, payload: UpsertOrderPayload): Observable<Order> {
    return this.http.put<Order>(`${base}/orders/${id}`, payload);
  }
  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/orders/${id}`);
  }
}
