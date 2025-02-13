 
import api from "./api/axios";
import { SaleData } from "@/types/transaction";

export const dashboardService = {
    getSaleData: async(startDate?: string, endDate?: string): Promise<SaleData[]> => {
        const {data} = await api.get('/transaction/getSaleData', {params:{startDate, endDate}})
        return data.data
    },
    getIncomeStatementData: async(startDate?: string, endDate?: string): Promise<SaleData> => {
        const {data} = await api.get('/transaction/getIncomeStatementData', {params:{startDate, endDate}})
        return data.data
    },
}