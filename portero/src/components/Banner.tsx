import logo from '../assets/icon.svg';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ModalForm from './modalForm';
import { useAppSelector, useAppDispatch } from '../services/redux/hooks';
import { fetchFormations } from '../services/redux/slices/data/formationSlice';
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

  // // Campos vacíos por ahora, se manejarán en el modal específico de QR
  // const leftFields: FieldConfig[] = [];
  // const rightFields: FieldConfig[] = [];
  // const elementFields: FieldConfig[] = [];

  const handleButtonClick = (type: 'ingreso' | 'salida', path: string) => {
    setModalType(type);
    setIsModalOpen(true);
    navigate(path);
  };

  const handleModalSubmit = (data: Record<string, any>) => {
    // Aquí se manejará la lógica de ingreso/salida
    console.log('Datos del formulario:', data);
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
          leftFields={[]}
          rightFields={[]}
          leftTitle={'Escáner QR'}
          rightTitle={'Información'}
          bannerMessage={undefined}
          initialValue={{}}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          modalType={modalType}
        />

      </div>
      {isAuthenticated && (
        <div style={{ display: 'flex', gap: '20px', marginLeft: '50px' }}>
          <button onClick={() => handleButtonClick('ingreso', '/entradas')} style={{
            marginLeft: '60px',
            padding: '10px 15px',
            backgroundColor: 'var(--primary)',
            color: 'var(--text)',
            borderRadius: '5px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            height: '70px',
          }}>
            Ingresos
          </button>
          <button onClick={() => handleButtonClick('salida', '/salidas')} style={{
            padding: '10px 15px',
            backgroundColor: 'var(--primary)',
            color: 'var(--text)',
            borderRadius: '5px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            height: '70px',
          }}>
            Salidas
          </button>
        </div>
      )}
    </div>
  );
};

export default Banner;