import {instance} from "../baseApi.tsx";

const endpoint = "portero/equipos-elementos"

export const elements = {
    getAll: function() {
        return instance.get(endpoint)
    }
}