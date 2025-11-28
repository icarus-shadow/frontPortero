import { instance } from "../baseApi.tsx";

const endpoint = "portero/nivel-formacion"

export const levelFormationApi = {
    getAll: async function () {
        try {
            const response = await instance.get(endpoint);
            if (response.data) {
                return response.data;
            }
            throw new Error('Invalid response format');
        } catch (e) {
            console.error("Error en obtener tipos de programa:", e);
            throw e;
        }
    },
}
