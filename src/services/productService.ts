/* eslint-disable @typescript-eslint/no-explicit-any */
 
import api from "./api/axios";
import { Product } from "@/types/product";

export const productService = {
    findAllAvailableProduct: async(): Promise<Product[]> => {
        const {data} = await api.get('/product/findAllAvailableProduct')
        return data.data
    },
    findAllProduct: async(): Promise<Product[]> => {
        const {data} = await api.get('/product')
        return data.data
    },
    updateProduct: async(product: Product): Promise<void> => {
        try{
            const {data} = await api.post('/product/updateProduct', product)
            return data.data
        }catch(error: any){
            // 處理錯誤
            if (error.response) {
                throw new Error(error.response.data.error || '更新商品異常')
            }
            console.error(error)
            throw new Error('網路錯誤')
        }
    },
    
}