import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { users } from "../../../api/data/Users.tsx";
import type { responseUsersSlice } from "../../../../types/interfacesData.tsx";

// Define the initial state using that type
const initialState: responseUsersSlice = {
    fetchSuccess: null,
    deleteSuccess: null,
    addSuccess: null,
    updateSuccess: null,
    success: null,
    data: [],
    count: 0,
}

export const fetchUsers = createAsyncThunk(
    'users/list',
    async () => {
        try {
            const response = await users.getAll();
            if (!response.data) {
                throw new Error('Respuesta inválida del servidor');
            }
            return response as responseUsersSlice;
        } catch (error) {
            throw error;
        }
    })


export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //fetch
            .addCase(fetchUsers.pending, (state) => {
                state.fetchSuccess = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.fetchSuccess = action.payload.success
                state.count = state.data?.length || 0;
            })
    }
})

export default usersSlice.reducer
