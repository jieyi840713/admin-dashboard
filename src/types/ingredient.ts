export interface Ingredient {
  id?: number;
  name: string;
  category: string;
  descript?: string;
}

export interface IngredientSponse {
  code: number;
  data: Ingredient[]
}
  