/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api/axios";
import { Ingredient, IngredientSponse } from "@/types/ingredient";


export const ingredientService = {
    createIngredient: async (ingredient: Ingredient): Promise<void> => {
        try{
            await api.post<Ingredient>('/ingredient/createIngredient', ingredient)
            return 
        }catch(error: any){
            // 處理錯誤
            if (error.response) {
                throw new Error(error.response.data.message || '建立材料失敗')
            }
            console.error(error)
            throw new Error('網路錯誤')
        }
    },
    getAllIngredient: async(): Promise<Ingredient[]>=>{
        const {data} = await api.get<IngredientSponse>('/ingredient/getAllIngredient')
        return data.data
    }
}