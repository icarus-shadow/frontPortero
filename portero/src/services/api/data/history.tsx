import { instance } from "../baseApi.tsx";

const endpoint = "portero/historial"

export const history = {
    getAll: async function () {
        try {
            const response = await instance.get(endpoint)
            if (response.data) {
                return response.data
            }
            throw new Error('Invalid response format');
        } catch (e) {
            throw e;
        }
    },
    create: async function (data: { usuario_id: number, equipos_o_elementos_id: number, datetime: string }) {
        try {
            const response = await instance.post(endpoint, data);
            if (response.data) {
                return response.data;
            }
            throw new Error('Invalid response format');
        } catch (e) {
            throw e;
        }
    }
}