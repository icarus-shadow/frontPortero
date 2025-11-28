import {instance} from "../baseApi.tsx";

const endpoint = "portero/aprendices"

export const users = {
    getAll: async function() {
        try{
            const response = await instance.get(endpoint);
            if (response.data) {
                return response.data;
            }
            throw new Error('Invalid response format');
        } catch (e) {
            console.error("Error en obtener usuarios:", e);
            throw e;
        }
    },
}