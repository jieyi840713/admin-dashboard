// 定義餐點類型
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}