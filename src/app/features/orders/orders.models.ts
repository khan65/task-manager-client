export interface OrderType {
  id: string;
  name: string;
  description: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderCode: string;
  stakeholderId: string;
  stakeholderName: string;
  orderTypeId: string;
  orderTypeName: string;
  orderDate: string;
  status: OrderStatus;
  notes: string;
  createdAt: string;
  totalAmount: number;
  items: OrderItem[];
}
