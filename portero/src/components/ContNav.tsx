import './styles/ContNav.css'
import CountCard from "./CounterCard.tsx";
import { useAppSelector } from '../services/redux/hooks';


import dayjs from 'dayjs';

const ContNav = () => {
    const historyData = useAppSelector(state => state.historyReducer.data);

    const activeElements = historyData ? historyData.filter(item => !item.salida || item.salida === '').length : 0;

    const exitedToday = historyData ? historyData.filter(item => item.salida && dayjs(item.salida).isSame(dayjs(), 'day')).length : 0;

    return (
        <div className="contMain">
            <CountCard path={'/entradas'} tittle={'Entradas'} number={activeElements} />
            <CountCard path={'/salidas'} tittle={'Salidas'} number={exitedToday} />
        </div>
    )
}

export default ContNav;