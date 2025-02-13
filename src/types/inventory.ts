export interface Inventory {
  id?: number;
  ingredientId: number;
  quantity: number;
  cost: number;
}

export interface InventorySponse {
  code: number;
  data: Inventory[]
}

export interface InventoryForm {
  items: Inventory[];
  referenceNo?: string;
  description?: string;
  payMethod: string
}