import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { responseHistory } from "../../../../types/interfacesData.tsx";
import { history } from "../../../api/data/history.tsx";


const initialState: responseHistory = {
    success: null,
    data: null,
    count: 0,
}

export const reloadHistory = createAsyncThunk(
    'reloadHistory',
    async () => {

    }
)

export const fetchHistory = createAsyncThunk(
    'fetchHistory',
    async () => {
        try {
            const response = await history.getAll();
            console.log(response);
            if (!response.data) {
                throw new Error('Respuesta inválida del servidor');
            }
            return response;
        } catch (error) {
            console.error("[historySlice] error al obtener historial", error)
            throw error;
        }
    }
)

export const createHistory = createAsyncThunk(
    'createHistory',
    async (data: { usuario_id: number, equipos_o_elementos_id: number }, { dispatch }) => {
        try {
            const response = await history.create(data);
            if (response.success) {
                // Recargar el historial después de crear un registro exitosamente
                dispatch(fetchHistory());
            }
            return response;
        } catch (error) {
            console.error("[historySlice] error al crear registro", error);
            throw error;
        }
    }
)

export const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHistory.pending, (state) => {
                state.success = null;
            })
            .addCase(fetchHistory.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.success = action.payload.success;
                state.count = state.data?.length || 0;
            })
            .addCase(fetchHistory.rejected, (state) => {
                state.success = false;
            })
            .addCase(createHistory.pending, (state) => {
                // Opcional: manejar estado de carga para creación
            })
            .addCase(createHistory.fulfilled, (state) => {
                // Opcional: manejar éxito de creación
            })
            .addCase(createHistory.rejected, (state) => {
                // Opcional: manejar error de creación
            })
    }

})

export default historySlice.reducer