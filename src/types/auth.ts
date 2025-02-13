// src/types/auth.ts
export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    code: number;
    data: {
        token: string;
        user: {
            id: string;
            username: string;
            email: string;
        };
    } 
    
  }
  
  export interface ApiError {
    message: string;
    status: number;
  }