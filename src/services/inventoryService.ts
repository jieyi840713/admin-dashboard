/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api/axios";
import { Inventory, InventorySponse, InventoryForm } from "@/types/inventory";


export const inventoryService = {
    createPurchaseInvertoryTransaction: async (purchaseOrder: InventoryForm): Promise<void> => {
        try{
            await api.post<InventoryForm>('/transaction/createPurchaseInvertoryTransaction', purchaseOrder)
            return 
        }catch(error: any){
            // 處理錯誤
            if (error.response) {
                throw new Error(error.response.data.message || '建立採購失敗')
            }
            console.error(error)
            throw new Error('網路錯誤')
        }
    },
    getAllInventory: async(): Promise<Inventory[]>=>{
        const {data} = await api.get<InventorySponse>('/inventory/getAllInventory')
        return data.data
    }
}