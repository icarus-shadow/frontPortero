import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { formation } from "../../../api/data/Formation.tsx";
import type { responseFormation } from "../../../../types/interfacesData.tsx";

// Define the initial state using that type
const initialState: responseFormation & {
    fetchSuccess: boolean | null;
    deleteSuccess: boolean | null;
    addSuccess: boolean | null;
    updateSuccess: boolean | null;
} = {
    fetchSuccess: null,
    deleteSuccess: null,
    addSuccess: null,
    updateSuccess: null,
    success: null,
    data: [],
    count: 0,
}

export const fetchFormations = createAsyncThunk(
    'formaciones/list',
    async () => {
        try {
            const response = await formation.getAll();
            if (!response.data) {
                throw new Error('Respuesta inválida del servidor');
            }
            return response as responseFormation;
        } catch (error) {
            console.error("[formationSlice] error al obtener formaciones", error)
            throw error;
        }
    })

export const formationSlice = createSlice({
    name: 'formaciones',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //fetch
            .addCase(fetchFormations.pending, (state) => {
                state.fetchSuccess = null;
            })
            .addCase(fetchFormations.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.fetchSuccess = action.payload.success
                state.count = state.data?.length || 0;
            })
    }
})

export default formationSlice.reducer
