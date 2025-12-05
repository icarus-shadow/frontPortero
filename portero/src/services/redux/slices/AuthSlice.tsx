import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Auth } from "../../api/Auth.tsx";
import type { responseLogin, userAuthState } from "../../../types/interfacesData.tsx";


export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            // Validación básica
            if (!credentials.email || !credentials.password) {
                return rejectWithValue('Email y contraseña son requeridos');
            }

            const response = await Auth.login(credentials);

            if (!response.data) {
                return rejectWithValue('Respuesta inválida del servidor');
            }

            return response as responseLogin;
        } catch (error: any) {
            // Manejo específico de errores HTTP
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || '';

                // Error 401 (Unauthorized) - credenciales incorrectas
                if (status === 401) {
                    return rejectWithValue('CREDENCIALES_INCORRECTAS');
                }

                // Otros errores del servidor
                return rejectWithValue(message || 'Error en el inicio de sesión');
            }

            // Error de red u otro tipo de error
            return rejectWithValue(error instanceof Error ? error.message : 'Error en el inicio de sesión');
        }
    }
);

const initialState: userAuthState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null,
    token: localStorage.getItem('token') || null,
}


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.data.user;
                state.token = action.payload.data.token;
            });
    },
});

export const { logout } = authSlice.actions;