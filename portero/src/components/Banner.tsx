import logo from '../assets/icon.svg';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ModalForm from './modalForm';
import { useAppSelector, useAppDispatch } from '../services/redux/hooks';
import { fetchFormations } from '../services/redux/slices/data/formationSlice';
import { logout } from '../services/redux/slices/AuthSlice';
import type { RootState } from '../services/redux/store';

const Banner = () => {
  const { user, token } = useAppSelector((state) => state.authReducer);
  const isAuthenticated = !!token && !!user;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'ingreso' | 'salida' | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const formations = useAppSelector((state: RootState) => state.formationsReducer.data);

  useEffect(() => {
    if (formations && formations.length === 0) {
      dispatch(fetchFormations());
    }
  }, [dispatch, formations?.length]);

  // const leftFields: FieldConfig[] = [];
  // const rightFields: FieldConfig[] = [];
  // const elementFields: FieldConfig[] = [];

  // (*) Función para manejar el clic en los botones de ingreso y salida
  const handleButtonClick = (type: 'ingreso' | 'salida', path: string) => {
    setModalType(type);
    setIsModalOpen(true);
    navigate(path);
  };

  // (*) Función para manejar el cierre de sesión
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleModalSubmit = (_data: Record<string, any>) => {
    setIsModalOpen(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <div style={{
        width: '700px',
        height: '110px',
        background: 'linear-gradient(to right, var(--secondary) 0%, transparent 83%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        borderRadius: '10px',
        boxSizing: 'border-box',
      }}>
        <a href="/" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
        }}>
          <img src={logo} alt="Lumina Logo" style={{ height: '80px', marginRight: '20px' }} />
          <span style={{ color: 'var(--text)', fontSize: '50px', fontWeight: 'bold' }}>LUMINA</span>
        </a>

        <ModalForm
          isOpen={isModalOpen}
          title={modalType === 'ingreso' ? 'Registrar Ingreso' : 'Registrar Salida'}
          bannerMessage={undefined}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          modalType={modalType}
        />

      </div>
      {isAuthenticated && (
        <div style={{ display: 'flex', gap: '20px', marginLeft: '50px' }}>
          <button
            onClick={() => handleButtonClick('ingreso', '/entradas')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(var(--primary-rgb), 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(127, 169, 143, 0.3)';
            }}
            style={{
              marginLeft: '60px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, var(--success-color), var(--primary))',
              color: 'var(--text)',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              height: '70px',
              boxShadow: '0 4px 15px rgba(127, 169, 143, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span>Ingresos</span>
          </button>
          <button
            onClick={() => handleButtonClick('salida', '/salidas')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(var(--secondary-rgb), 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(var(--primary-rgb), 0.3)';
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: 'var(--text)',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              height: '70px',
              boxShadow: '0 4px 15px rgba(var(--primary-rgb), 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Salidas</span>
          </button>
          <button
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(var(--accent-rgb), 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(201, 122, 122, 0.3)';
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, var(--error-color), var(--accent))',
              color: 'var(--text)',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              height: '70px',
              boxShadow: '0 4px 15px rgba(201, 122, 122, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Banner;