import { instance } from "../baseApi.tsx";

const endpoint = "portero/equipos-elementos"

export const elements = {
    getAll: function () {
        return instance.get(endpoint)
    },
    asignarElementos: function (equipoId: number, elementosIds: number[]) {
        return instance.post(`${endpoint}/asignar-elementos`, {
            equipos_o_elementos_id: equipoId,
            elementos_adicionales_ids: elementosIds
        });
    },
    quitarElementos: function (equipoId: number, elementosIds: number[]) {
        return instance.post(`${endpoint}/quitar-elementos`, {
            equipos_o_elementos_id: equipoId,
            elementos_adicionales_ids: elementosIds
        });
    },
    obtenerAsignaciones: function (equipoId: number) {
        return instance.get(`${endpoint}/asignaciones/${equipoId}`);
    }
}