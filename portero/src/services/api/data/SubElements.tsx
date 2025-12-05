import { instance } from "../baseApi.tsx";

const endpoint = "portero/elementos-adicionales"

export const subElementsApi = {
    getAll: async function () {
        try {
            const response = await instance.get(endpoint);
            if (response.data) {
                return response.data;
            }
            throw new Error('Invalid response format');
        } catch (e) {
            throw e;
        }
    },
}
