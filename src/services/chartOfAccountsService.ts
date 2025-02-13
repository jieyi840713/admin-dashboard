 
import api from "./api/axios";
import { Chartsponse, ChartOfAccount } from "@/types/charts";

export const chartOfAccountsService = {
    getAllChartOfAccounts: async (): Promise<ChartOfAccount[]> => {
        const {data} = await api.get<Chartsponse>('/chartOfAccount/getAllChartOfAccounts')
        return data.data
    }
}