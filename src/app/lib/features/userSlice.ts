import { createSlice } from '@reduxjs/toolkit'

export interface User {
    username: string;
    roleCode: string;
}

const initialState: User = {
    username: '',
    roleCode: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, {payload}) => {
            state.username = payload.username
            state.roleCode = payload.roleCode
        }
    }
})

export const {setUser} = userSlice.actions
export default userSlice.reducer