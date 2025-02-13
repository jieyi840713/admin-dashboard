// src/services/api/axios.ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000  // 添加請求超時設置
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `${token}`
  }
  return config
})

// Response 攔截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // 處理 token 相關錯誤
      switch (error.response.status) {
        case 401: // Unauthorized
        case 403: // Forbidden
          // 清除 localStorage
          localStorage.removeItem('token')
          // 如果是在客戶端環境，重定向到登入頁面
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          break
        case 404: // Not Found
          console.log('Resource not found:', error.config.url)
          break
        
        case 500: // Server Error
          console.log('Server error:', error.response.data)
          break
        
        default:
          console.log('API Error:', error.response.data)
          break
      }
    } else if (error.request) {
      // 請求發送失敗（可能是網路問題）
      console.log('Request failed:', error.request)
    } else {
      // 其他錯誤
      console.log('Error:', error.message)
    }
    return Promise.reject(error)
  }
)


export default api