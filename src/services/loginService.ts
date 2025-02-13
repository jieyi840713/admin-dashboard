/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api/axios";
import { LoginCredentials, LoginResponse } from "@/types/auth";

export const loginService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        try{
            const {data} = await api.post<LoginResponse>('/users/login', credentials)

            // 儲存 token 到 localStorage
            if (data.data.token) {
                localStorage.setItem('token', data.data.token)
            }
            
            return data
        }catch(error: any){
            // 處理錯誤
            if (error.response) {
                throw new Error(error.response.data.message || '登入失敗')
            }
            console.error(error)
            throw new Error('網路錯誤')
        }
    }
}