import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { levelFormationApi } from "../../../api/data/LevelFormation.tsx";
import type { responseLevelFormation } from "../../../../types/interfacesData.tsx";

// Define the initial state using that type
const initialState: responseLevelFormation & {
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

export const fetchLevelFormations = createAsyncThunk(
    'levelFormations/list',
    async () => { 
        try {
            const response = await levelFormationApi.getAll();
            if (!response.data) {
                throw new Error('Respuesta inválida del servidor');
            }
            return response as responseLevelFormation;
        } catch (error) {
            throw error;
        }
    })

export const levelFormationSlice = createSlice({
    name: 'levelFormations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //fetch
            .addCase(fetchLevelFormations.pending, (state) => {
                state.fetchSuccess = null;
            })
            .addCase(fetchLevelFormations.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.fetchSuccess = action.payload.success
                state.count = state.data?.length || 0;
            })
    }
})

export default levelFormationSlice.reducer
