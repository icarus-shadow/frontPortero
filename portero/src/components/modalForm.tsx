import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Grid, Typography, Alert, Button
} from "@mui/material";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useAppSelector, useAppDispatch } from '../services/redux/hooks.tsx';
import { fetchHistory, createHistory } from '../services/redux/slices/data/historySlice.tsx';
import { useAlert } from '../components/AlertSystem';
import type { users, elements } from '../types/interfacesData.tsx';

// =============================
// Types
// =============================
interface ModalFormProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    onSubmit: (data: Record<string, any>) => void;
    bannerMessage?: string;
    bannerSeverity?: 'success' | 'info' | 'warning' | 'error';
    modalType?: 'ingreso' | 'salida' | null;
}

// =============================
// Modal QR Scanner Component
// =============================
const ModalForm: React.FC<ModalFormProps> = ({
    isOpen,
    title,
    onClose,
    onSubmit,
    bannerMessage,
    bannerSeverity,
    modalType
}) => {
    const [scannedCode, setScannedCode] = useState<string>('');

    const html5QrcodeScannerRef = useRef<Html5QrcodeScanner | null>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const [scannedUser, setScannedUser] = useState<users | null>(null);
    const [scannedElement, setScannedElement] = useState<elements | null>(null);
    const [showOwnershipAlert, setShowOwnershipAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);
    const [showEntryAlert, setShowEntryAlert] = useState<boolean>(false);
    const [showExitAlert, setShowExitAlert] = useState<boolean>(false);
    const [entryAlertMessage, setEntryAlertMessage] = useState<string>('');
    const [exitAlertMessage, setExitAlertMessage] = useState<string>('');

    const usersData = useAppSelector((state) => state.usersReducer.data);
    const elementsData = useAppSelector((state) => state.elementsReducer.data);
    const dispatch = useAppDispatch();
    const historyData = useAppSelector((state) => state.historyReducer.data);
    const { showAlert } = useAlert();

    const [buffer, setBuffer] = useState("");
    const [lastTime, setLastTime] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const currentTime = Date.now();

            // Si ha pasado demasiado tiempo, reiniciar buffer
            if (currentTime - lastTime > 500) {
                setBuffer("");
            }

            // El lector usualmente envía Enter al final
            if (e.key === "Enter") {
                if (buffer.length > 0) {
                    const matchedUser = usersData?.find((user: users | null) => user !== null && user.documento === buffer);

                    if (!matchedUser) {
                        showAlert('error', 'usuario no registrado');
                        return;
                    }
                    if (matchedUser) {
                        // Si ya hay un usuario escaneado, no sobrescribir
                        if (scannedUser) {
                            showAlert('error', 'Ya hay un usuario escaneado. Límpielo primero si desea escanear otro.');
                            return;
                        }

                        if (scannedElement && !scannedElement.usuarios.some(user => user.id == matchedUser.id)) {
                            setAlertMessage('El usuario no es propietario del elemento. ¿Confirmar de todos modos?');
                            setOnConfirm(() => () => {
                                setScannedUser(matchedUser);
                                setScannedCode(buffer);
                                setShowOwnershipAlert(false);
                            });
                            setShowOwnershipAlert(true);
                            return;
                        } else {
                            setScannedUser(matchedUser);
                        }
                    }
                    setBuffer("");
                }
                return;
            }

            // Agregar la tecla al buffer si es un caracter válido
            if (/^[0-9A-Za-z]$/.test(e.key)) {
                setBuffer(prev => prev + e.key);
            }

            setLastTime(currentTime);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [buffer, lastTime]);

    const resetForm = () => {
        setScannedCode('');

        setScannedUser(null);
        setScannedElement(null);
        setShowEntryAlert(false);
        setShowExitAlert(false);
        setShowOwnershipAlert(false);
        setEntryAlertMessage('');
        setExitAlertMessage('');
        setAlertMessage('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (scannedUser && scannedElement) {
            dispatch(createHistory({
                usuario_id: scannedUser.id,
                equipos_o_elementos_id: scannedElement.id,
                datetime: new Date().toISOString()
            })).then(() => {
                // Opcional: Mostrar notificación de éxito
                showAlert('success', 'Registro procesado exitosamente');
            });
        } else {
            onSubmit({ codigo: scannedCode });
        }

        // Solo limpiar los datos escaneados, no cerrar el modal
        setScannedCode('');
        setScannedUser(null);
        setScannedElement(null);
        setShowEntryAlert(false);
        setShowExitAlert(false);
    };

    useEffect(() => {
        if (isOpen) {
            setScannedCode('');
            setScannedUser(null);
            setScannedElement(null);
        }
        if (isOpen && (modalType === 'ingreso' || modalType === 'salida')) {
            dispatch(fetchHistory());
        }
    }, [isOpen, modalType, dispatch]);

    // Validación de historial
    useEffect(() => {

        // Verificar que historyData sea un array válido
        if (scannedUser && scannedElement && Array.isArray(historyData)) {

            if (modalType === 'ingreso') {
                // Verificar si hay un ingreso pendiente (sin salida)
                const hasPendingEntry = historyData.some(h => {
                    const isThisElement = h.equipos_o_elementos_id === scannedElement.id;
                    const noSalida = !h.salida || h.salida === null || h.salida === '';
                    return isThisElement && noSalida;
                });

                if (hasPendingEntry) {
                    setScannedUser(null);
                    setScannedElement(null);
                    setEntryAlertMessage('El elemento tiene un ingreso anterior pendiente. Los datos escaneados han sido limpiados automáticamente para prevenir problemas de integridad de datos, ya que el sistema no permite inconsistencias.');
                    setShowEntryAlert(true);
                }
            } else if (modalType === 'salida') {
                // Verificar si hay un ingreso activo (sin salida)
                const hasActiveEntry = historyData.some(h => {
                    const isThisElement = h.equipos_o_elementos_id === scannedElement.id;
                    const noSalida = !h.salida || h.salida === null || h.salida === '';
                    return isThisElement && noSalida;
                });

                if (!hasActiveEntry) {
                    setScannedUser(null);
                    setScannedElement(null);
                    setExitAlertMessage('El elemento no tiene un historial activo previo. Los datos escaneados han sido limpiados automáticamente para prevenir problemas de integridad de datos, ya que el sistema no permite inconsistencias.');
                    setShowExitAlert(true);
                }
            }
        } else {
        }
    }, [scannedUser, scannedElement, modalType, historyData]);

    const isQrMode = modalType === 'ingreso' || modalType === 'salida';

    // Inicializar y limpiar el escáner QR
    useLayoutEffect(() => {
        // Función de limpieza del escáner
        const cleanupScanner = () => {
            if (html5QrcodeScannerRef.current) {
                try {
                    html5QrcodeScannerRef.current.clear();
                } catch (error) {
                }
                html5QrcodeScannerRef.current = null;
            }
        };

        if (isOpen && isQrMode) {
            // Limpiar escáner existente antes de crear uno nuevo
            cleanupScanner();

            // Función de éxito al escanear
            const onScanSuccess = (decodedText: string) => {
                // Si ya tenemos ambos datos, no procesar más escaneos
                if (scannedUser && scannedElement) return;


                if (!decodedText || decodedText.trim() === '') {
                    return;
                }

                const matchedUser = usersData?.find((user: users | null) => user !== null && user.documento === decodedText);
                const matchedElement = elementsData?.find((element: elements | null) => element !== null && element.qr_hash === decodedText);

                if (matchedUser && matchedElement) {
                    showAlert('error', 'El código coincide con un usuario y un elemento. No se puede determinar cuál escanear.');
                    return;
                }

                if (!matchedUser && !matchedElement) {
                    showAlert('error', 'Código no encontrado en usuarios ni elementos.');
                    return;
                }

                if (matchedUser) {
                    // Si ya hay un usuario escaneado, no sobrescribir
                    if (scannedUser) {
                        showAlert('error', 'Ya hay un usuario escaneado. Límpielo primero si desea escanear otro.');
                        return;
                    }

                    if (scannedElement && !scannedElement.usuarios.some(user => user.id == matchedUser.id)) {
                        setAlertMessage('El usuario no es propietario del elemento. ¿Confirmar de todos modos?');
                        setOnConfirm(() => () => {
                            setScannedUser(matchedUser);
                            setScannedCode(decodedText);
                            setShowOwnershipAlert(false);
                        });
                        setShowOwnershipAlert(true);
                        return;
                    } else {
                        setScannedUser(matchedUser);
                    }
                }

                if (matchedElement) {
                    // Si ya hay un elemento escaneado, no sobrescribir
                    if (scannedElement) {
                        showAlert('error', 'Ya hay un elemento escaneado. Límpielo primero si desea escanear otro.');
                        return;
                    }

                    if (scannedUser && !matchedElement.usuarios.some(user => user.id === scannedUser.id)) {
                        setAlertMessage('El usuario no es propietario del elemento. ¿Confirmar de todos modos?');
                        setOnConfirm(() => () => {
                            setScannedElement(matchedElement);
                            setScannedCode(decodedText);
                            setShowOwnershipAlert(false);
                        });
                        setShowOwnershipAlert(true);
                        return;
                    } else {
                        setScannedElement(matchedElement);
                    }
                }

                if ((matchedUser || matchedElement) && !showOwnershipAlert) {
                    setScannedCode(decodedText);
                }
            };

            // Función de fallo al escanear
            const onScanFailure = (_error: any) => {
                // Silenciar errores de escaneo
            };

            // Inicializar el escáner después de un pequeño delay para asegurar que el DOM esté listo
            const timeoutId = setTimeout(() => {
                if (divRef.current && !html5QrcodeScannerRef.current) {
                    divRef.current.id = "qr-reader";
                    const config = {
                        fps: 10,
                        formatsToSupport: [
                            Html5QrcodeSupportedFormats.QR_CODE,
                            Html5QrcodeSupportedFormats.CODE_128,
                            Html5QrcodeSupportedFormats.CODE_39,
                            Html5QrcodeSupportedFormats.EAN_13,
                            Html5QrcodeSupportedFormats.UPC_A,
                            Html5QrcodeSupportedFormats.UPC_E,
                        ],
                    };
                    const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", config, false);
                    try {
                        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
                        html5QrcodeScannerRef.current = html5QrcodeScanner;
                    } catch (error) {
                    }
                }
            }, 100);

            return () => {
                clearTimeout(timeoutId);
                cleanupScanner();
            };
        } else {
            // Si el modal está cerrado o no es modo QR, limpiar el escáner
            cleanupScanner();
        }

        return () => {
            cleanupScanner();
        };
    }, [isOpen, isQrMode, usersData, elementsData, scannedUser, scannedElement, showOwnershipAlert]);

    return (
        <>
            <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth
                sx={{ '& .MuiDialog-paper': { borderRadius: 0 } }}>
                <DialogTitle sx={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}>{title}</DialogTitle>
                {bannerMessage && <Alert severity={bannerSeverity || 'info'} sx={{ margin: 2 }}>{bannerMessage}</Alert>}
                <DialogContent sx={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}>
                    <form onSubmit={handleSubmit}>
                        <Grid sx={{ minWidth: 950, justifyContent: 'space-evenly', p: 4 }} container spacing={4}>
                            <Grid item md={6} sx={{
                                maxHeight: 500,
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                p: 1,
                                backgroundColor: 'rgba(var(--secondary-rgb), 0.2)',
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10
                            }}>
                                <Typography variant="h6" sx={{
                                    color: 'var(--secondary)',
                                    mb: 2,
                                    fontWeight: 'bold'
                                }}>Escáner QR</Typography>
                                {isQrMode ? (
                                    <>
                                        {/* Mostrar escáner solo si falta usuario o elemento */}
                                        {(!scannedUser || !scannedElement) && (
                                            <div ref={divRef} style={{
                                                width: '100%',
                                                maxWidth: '100%',
                                                height: '300px',
                                                overflow: 'hidden',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center'
                                            }}>
                                            </div>
                                        )}
                                        {/* Mensaje cuando ambos datos están completos */}
                                        {scannedUser && scannedElement && (
                                            <div style={{
                                                width: '100%',
                                                height: '300px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                borderRadius: '10px',
                                                border: '2px dashed #4caf50'
                                            }}>
                                                <Typography sx={{
                                                    color: '#4caf50',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.2rem',
                                                    textAlign: 'center',
                                                    px: 2
                                                }}>
                                                    ✓ Datos completos<br />
                                                    Listo para procesar
                                                </Typography>
                                            </div>
                                        )}
                                        <style>{`
                                            #qr-reader {
                                                width: 100% !important;
                                                max-width: 100% !important;
                                                box-sizing: border-box !important;
                                            }
                                            #qr-reader > div,
                                            #qr-reader > div > div {
                                                width: 100% !important;
                                                max-width: 100% !important;
                                                box-sizing: border-box !important;
                                            }
                                            #qr-reader video {
                                                width: 100% !important;
                                                max-width: 100% !important;
                                                height: auto !important;
                                                object-fit: contain !important;
                                            }
                                            #qr-reader canvas {
                                                width: 100% !important;
                                                max-width: 100% !important;
                                                height: auto !important;
                                            }
                                            #qr-reader__dashboard_section,
                                            #qr-reader__dashboard_section_csr,
                                            #qr-reader__dashboard_section_swaplink {
                                                width: 100% !important;
                                                max-width: 100% !important;
                                                box-sizing: border-box !important;
                                            }
                                            #qr-reader__scan_region {
                                                width: 100% !important;
                                                max-width: 100% !important;
                                            }
                                        `}</style>
                                    </>
                                ) : null}
                            </Grid>
                            <Grid item md={6} sx={{
                                maxHeight: 500,
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                p: 2,
                                backgroundColor: 'rgba(var(--secondary-rgb), 0.2)',
                                borderTopRightRadius: 10,
                                borderBottomRightRadius: 10
                            }}>
                                <Typography variant="h6" sx={{
                                    color: 'var(--secondary)',
                                    mb: 2,
                                    fontWeight: 'bold'
                                }}>Información Escaneada</Typography>
                                {scannedUser && (
                                    <div style={{
                                        marginBottom: '15px',
                                        position: 'relative',
                                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                        padding: '15px',
                                        borderRadius: '10px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '10px'
                                        }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                                Usuario Escaneado:
                                            </Typography>
                                            <Button
                                                onClick={() => setScannedUser(null)}
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                sx={{
                                                    minWidth: 'auto',
                                                    px: 2,
                                                    py: 0.5,
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                Limpiar
                                            </Button>
                                        </div>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <img
                                                src={`https://lumina-testing.onrender.com/api/images/${scannedUser.path_foto}`}
                                                alt={`${scannedUser.nombre} ${scannedUser.apellido}`}
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                    border: '2px solid var(--primary)'
                                                }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=User';
                                                }}
                                            />
                                            <div>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{scannedUser.nombre} {scannedUser.apellido}</Typography>
                                                <Typography variant="body2" color="text.secondary">Doc: {scannedUser.documento}</Typography>
                                                <Typography variant="body2" color="text.secondary">Rol: {scannedUser.role?.nombre_rol || 'N/A'}</Typography>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {scannedElement && (
                                    <div style={{
                                        marginBottom: '15px',
                                        position: 'relative',
                                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                        padding: '15px',
                                        borderRadius: '10px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '10px'
                                        }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                                Elemento Escaneado:
                                            </Typography>
                                            <Button
                                                onClick={() => setScannedElement(null)}
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                sx={{
                                                    minWidth: 'auto',
                                                    px: 2,
                                                    py: 0.5,
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                Limpiar
                                            </Button>
                                        </div>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <img
                                                src={`https://lumina-testing.onrender.com/api/images/${scannedElement.path_foto_equipo_implemento}`}
                                                alt={scannedElement.tipo_elemento}
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    objectFit: 'cover',
                                                    borderRadius: '10px',
                                                    border: '2px solid var(--primary)'
                                                }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Element';
                                                }}
                                            />
                                            <div>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{scannedElement.tipo_elemento}</Typography>
                                                <Typography variant="body2" color="text.secondary">Serie: {scannedElement.sn_equipo}</Typography>
                                                <Typography variant="body2" color="text.secondary">{scannedElement.descripcion}</Typography>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: 'var(--background)', justifyContent: 'flex-end', padding: '16px' }}>
                    <button type="button" onClick={() => {
                        resetForm();
                        onClose();
                    }} className="btn-cancel" style={{
                        marginRight: '10px',
                        backgroundColor: 'var(--button-cancel-bg)',
                        color: 'var(--button-cancel-color)',
                        border: `1px solid var(--button-cancel-border)`,
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                    }} onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--accent)'}
                        onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--button-cancel-bg)'}>
                        Cancelar
                    </button>
                    <button type="button" onClick={() => handleSubmit(new Event('submit') as any)} className="btn-save"
                        disabled={!(scannedUser && scannedElement)} style={{
                            backgroundColor: 'var(--button-save-bg)',
                            color: 'var(--button-save-color)',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s'
                        }} onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--primary-hover)'}
                        onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--button-save-bg)'}>
                        {modalType === 'ingreso' ? 'dar ingreso' : modalType === 'salida' ? 'dar salida' : 'Guardar'}
                    </button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={showOwnershipAlert}
                onClose={() => setShowOwnershipAlert(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        border: '4px solid #1976d2',
                        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.4)'
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    py: 3
                }}>
                    ⚠️ VERIFICACIÓN DE PROPIEDAD ⚠️
                </DialogTitle>
                <DialogContent sx={{
                    backgroundColor: '#e3f2fd',
                    py: 4,
                    px: 3
                }}>
                    <Alert severity="info" sx={{
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        mb: 2
                    }}>
                        {alertMessage}
                    </Alert>
                    <Typography sx={{
                        mt: 2,
                        fontSize: '0.95rem',
                        color: '#666'
                    }}>
                        El usuario escaneado no aparece como propietario registrado del elemento.
                        ¿Desea continuar de todos modos?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{
                    backgroundColor: '#e3f2fd',
                    justifyContent: 'center',
                    gap: 2,
                    pb: 3
                }}>
                    <Button
                        onClick={() => setShowOwnershipAlert(false)}
                        variant="outlined"
                        size="large"
                        sx={{
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            '&:hover': {
                                borderColor: '#1565c0',
                                backgroundColor: 'rgba(25, 118, 210, 0.1)'
                            }
                        }}
                    >
                        CANCELAR
                    </Button>
                    <Button
                        onClick={() => {
                            if (onConfirm) onConfirm();
                        }}
                        variant="contained"
                        size="large"
                        sx={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            '&:hover': {
                                backgroundColor: '#1565c0'
                            }
                        }}
                    >
                        CONFIRMAR
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={showEntryAlert}
                onClose={() => { }}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        border: '4px solid #d32f2f',
                        boxShadow: '0 8px 32px rgba(211, 47, 47, 0.4)'
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    py: 3
                }}>
                    ⚠️ INCONSISTENCIA DETECTADA ⚠️
                </DialogTitle>
                <DialogContent sx={{
                    backgroundColor: '#ffebee',
                    py: 4,
                    px: 3
                }}>
                    <Alert severity="error" sx={{
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        mb: 2
                    }}>
                        {entryAlertMessage}
                    </Alert>
                </DialogContent>
                <DialogActions sx={{
                    backgroundColor: '#ffebee',
                    justifyContent: 'center',
                    pb: 3
                }}>
                    <Button
                        onClick={() => setShowEntryAlert(false)}
                        variant="contained"
                        size="large"
                        sx={{
                            backgroundColor: '#d32f2f',
                            color: 'white',
                            fontWeight: 'bold',
                            px: 6,
                            py: 1.5,
                            fontSize: '1.1rem',
                            '&:hover': {
                                backgroundColor: '#b71c1c'
                            }
                        }}
                    >
                        ENTENDIDO
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={showExitAlert}
                onClose={() => { }}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        border: '4px solid #f57c00',
                        boxShadow: '0 8px 32px rgba(245, 124, 0, 0.4)'
                    }
                }}
            >
                <DialogTitle sx={{
                    backgroundColor: '#f57c00',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    py: 3
                }}>
                    ⚠️ ELEMENTO NO INGRESADO ⚠️
                </DialogTitle>
                <DialogContent sx={{
                    backgroundColor: '#fff3e0',
                    py: 4,
                    px: 3
                }}>
                    <Alert severity="warning" sx={{
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        mb: 2
                    }}>
                        {exitAlertMessage}
                    </Alert>
                </DialogContent>
                <DialogActions sx={{
                    backgroundColor: '#fff3e0',
                    justifyContent: 'center',
                    pb: 3
                }}>
                    <Button
                        onClick={() => setShowExitAlert(false)}
                        variant="contained"
                        size="large"
                        sx={{
                            backgroundColor: '#f57c00',
                            color: 'white',
                            fontWeight: 'bold',
                            px: 6,
                            py: 1.5,
                            fontSize: '1.1rem',
                            '&:hover': {
                                backgroundColor: '#e65100'
                            }
                        }}
                    >
                        ENTENDIDO
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ModalForm;
