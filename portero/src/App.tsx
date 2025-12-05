import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';

import Entradas from './pages/entradas.tsx';
import Salidas from './pages/salidas.tsx';
import ContNav from "./components/ContNav.tsx";
import Banner from "./components/Banner.tsx";
import { useAppSelector } from "./services/redux/hooks";
import UsersEffects from "./services/useEffects/users.tsx";
import { HistoryEffects } from "./services/useEffects/history.tsx";
import SliceEffects from "./services/useEffects/slice.tsx";

function App() {
    const { user, token } = useAppSelector((state) => state.authReducer);
    // Validar que exista token, usuario y que el rol sea Celador (3)
    const isAuthenticated = !!token && !!user && user.role_id === 3;

    return (
        <Router>
            <Banner />

            {isAuthenticated ? (
                <>
                    <UsersEffects />
                    <HistoryEffects />
                    <SliceEffects />
                    <ContNav />
                    <Routes>
                        <Route path="/" element={<Navigate to="/entradas" replace />} />
                        <Route path="/entradas" element={<Entradas />} />
                        <Route path="/salidas" element={<Salidas />} />
                        <Route path="/login" element={<Navigate to="/entradas" replace />} />
                        <Route path="*" element={<Navigate to="/entradas" replace />} />
                    </Routes>
                </>
            ) : (
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            )}
        </Router>)
}

export default App
