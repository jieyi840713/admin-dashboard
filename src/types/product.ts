import { Ingredient } from "./ingredient";

export interface ProductMadeBy extends Ingredient{
  quantity: number
}

export interface Product {
  id: number;
  name: string;
  price: number;
  isAvailable?: number;
  descript?: string;
  imageUrl?: string;
  madeBy?: ProductMadeBy[];
  cost?: string
}

export interface Products {
  code: number;
  data: Product[]
}
