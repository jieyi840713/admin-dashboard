/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api/axios";
import { Order, OrderResponse } from "@/types/order";

export const orderService = {
    createSaleInventoryTransaction: async (order: Order): Promise<void> => {
        try{
            await api.post<Order>('/order/createSaleInventoryTransaction', order)
            return 
        }catch(error: any){
            // 處理錯誤
            if (error.response) {
                throw new Error(error.response.data.error || '建立訂單失敗')
            }
            console.error(error)
            throw new Error('網路錯誤')
        }
    },
    getAllPrepareOrder: async(): Promise<OrderResponse[]> => {
        try{
            const {data} = await api.get('/order/getAllPrepareOrderDetail')
            return data.data
        }catch(error: any){
            // 處理錯誤
            if (error.response) {
                throw new Error(error.response.data.error || '搜尋訂單失敗')
            }
            console.error(error)
            throw new Error('網路錯誤')
        }
    },
    updateOrderStatus: async (orderId: number, status: string, referenceNo: string): Promise<void> => {
        try{
            await api.post<Order>('/order/updateOrderStatus', {orderId, status, referenceNo})
            return 
        }catch(error: any){
            // 處理錯誤
            if (error.response) {
                throw new Error(error.response.data.error || '更新訂單失敗')
            }
            console.error(error)
            throw new Error('網路錯誤')
        }
    },
}