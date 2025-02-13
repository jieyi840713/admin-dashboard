export enum PaymentMethod {
  Cash = 'Cash',
}

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  items: OrderItem[];
  description?: string;
  payMethod: PaymentMethod;
}

export interface OrderDetail {
  quantity: number;
  productName: string;
}

export interface OrderResponse {
  orderId: number;
  referenceNo: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  items: OrderDetail[]
  createdAt: string;
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled';