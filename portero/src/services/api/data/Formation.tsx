import { instance } from "../baseApi.tsx";

const endpoint = "portero/formaciones"

export const formation = {
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