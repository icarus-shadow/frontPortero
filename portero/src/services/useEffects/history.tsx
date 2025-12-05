import Pusher from "pusher-js";
import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { reloadHistory } from "../redux/slices/data/historySlice";

export const HistoryEffects = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const pusher = new Pusher('3961091702fc34d8a2d3', {
            cluster: 'us2'
        });

        const channel = pusher.subscribe('historial-updates');

        channel.bind('historial.updated', function (data: any) {
            try {
                // Extraer el array de historiales del objeto
                let historyArray = null;

                if (Array.isArray(data)) {
                    // Si data ya es un array, usarlo directamente
                    historyArray = data;
                } else if (data && typeof data === 'object' && Array.isArray(data.historiales)) {
                    // Si data es un objeto con propiedad 'historiales' que es un array
                    historyArray = data.historiales;
                } else {
                    return;
                }

                dispatch(reloadHistory(historyArray));

            } catch (error) {
            }
        });

        // Función de limpieza: desconectar cuando el componente se desmonte
        return () => {
            channel.unbind('historial.updated');
            pusher.unsubscribe('historial-updates');
            pusher.disconnect();
        };
    }, [dispatch]);

    return (
        <></>
    )
}
