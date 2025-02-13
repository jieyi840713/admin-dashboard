/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api/axios";
import { Transaction } from "@/types/transaction";
import { DraftTransaction } from "@/types/transaction";

export const transactionService = {
    createTransaction: async (transaction: Transaction): Promise<void> => {
        try{
            await api.post<Transaction>('/transaction/createTransaction', transaction)
            return 
        }catch(error: any){
            // 處理錯誤
            if (error.response) {
                throw new Error(error.response.data.message || '分錄創建失敗')
            }
            console.error(error)
            throw new Error('網路錯誤')
        }
    },
    getAllDraftTrasaction: async(): Promise<DraftTransaction[]> => {
        const {data} = await api.get('/transaction/getAllDraftTrasaction')
        return data.data
    },
    updateTransaction: async (transactionId: number, status: string): Promise<void> => {
        try{
            await api.post<Transaction>('/transaction/updateTransaction', {transactionId, status})
            return 
        }catch(error: any){
            // 處理錯誤
            if (error.response) {
                throw new Error(error.response.data.message || '入帳狀態更新異常')
            }
            console.error(error)
            throw new Error('網路錯誤')
        }
    },
}