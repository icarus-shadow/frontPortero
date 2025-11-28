import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Grid, Typography, Alert, Button
} from "@mui/material";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useAppSelector, useAppDispatch } from '../services/redux/hooks.tsx';
import { fetchHistory, createHistory } from '../services/redux/slices/data/historySlice.tsx';
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
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [scannedData, setScannedData] = useState<string | null>(null);
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
    const [isBlocked, setIsBlocked] = useState<boolean>(false);
    const [onConfirmEntry, setOnConfirmEntry] = useState<(() => void) | null>(null);
    const [onConfirmExit, setOnConfirmExit] = useState<(() => void) | null>(null);

    const usersData = useAppSelector((state) => state.usersReducer.data);
    const elementsData = useAppSelector((state) => state.elementsReducer.data);
    const dispatch = useAppDispatch();
    const historyData = useAppSelector((state) => state.historyReducer.data);

    const resetForm = () => {
        setScannedCode('');
        setShowAlert(false);
        setScannedData(null);
        setScannedUser(null);
        setScannedElement(null);
        setShowEntryAlert(false);
        setShowExitAlert(false);
        setShowOwnershipAlert(false);
        setEntryAlertMessage('');
        setExitAlertMessage('');
        setAlertMessage('');
        setIsBlocked(false);
        setOnConfirmEntry(null);
        setOnConfirmExit(null);
        setOnConfirm(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (scannedUser && scannedElement) {
            dispatch(createHistory({
                usuario_id: scannedUser.id,
                equipos_o_elementos_id: scannedElement.id
            })).then(() => {
                // Opcional: Mostrar notificación de éxito
                alert('Registro procesado exitosamente');
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
        setIsBlocked(false);
    };

    useEffect(() => {
        if (isOpen) {
            setScannedCode('');
            setScannedData(null);
            setScannedUser(null);
            setScannedElement(null);
        }
        if (isOpen && (modalType === 'ingreso' || modalType === 'salida')) {
            dispatch(fetchHistory());
        }
    }, [isOpen, modalType, dispatch]);

    // Validación de historial
    useEffect(() => {
        console.log('🔄 useEffect validación ejecutado:', {
            scannedUser: !!scannedUser,
            scannedUserData: scannedUser,
            scannedElement: !!scannedElement,
            scannedElementData: scannedElement,
            historyData: !!historyData,
            historyDataIsArray: Array.isArray(historyData),
            historyDataLength: historyData?.length,
            modalType
        });

        // Verificar que historyData sea un array válido
        if (scannedUser && scannedElement && Array.isArray(historyData)) {
            console.log(' Todas las condiciones cumplidas - Verificando historial:', {
                modalType,
                scannedElementId: scannedElement.id,
                historyDataCount: historyData.length,
                todosLosRegistros: historyData
            });

            if (modalType === 'ingreso') {
                console.log(' Modo INGRESO - Buscando ingresos pendientes...');

                // Verificar si hay un ingreso pendiente (sin salida)
                const registrosDelElemento = historyData.filter(h => h.equipos_o_elementos_id === scannedElement.id);
                console.log(' Registros del elemento:', registrosDelElemento);

                const hasPendingEntry = historyData.some(h => {
                    const isThisElement = h.equipos_o_elementos_id === scannedElement.id;
                    const noSalida = !h.salida || h.salida === null || h.salida === '';
                    console.log('🔍 Verificando registro:', {
                        id: h.id,
                        equipos_o_elementos_id: h.equipos_o_elementos_id,
                        scannedElementId: scannedElement.id,
                        isThisElement,
                        salida: h.salida,
                        tipoSalida: typeof h.salida,
                        noSalida,
                        match: isThisElement && noSalida
                    });
                    return isThisElement && noSalida;
                });

                console.log(' Ingreso - hasPendingEntry:', hasPendingEntry);

                if (hasPendingEntry) {
                    console.log('⚠ ALERTA DE INGRESO ACTIVADA');
                    setEntryAlertMessage('El elemento tiene un ingreso anterior pendiente. Inconsistencia detectada.');
                    setShowEntryAlert(true);
                    setIsBlocked(true);
                    setOnConfirmEntry(() => () => {
                        console.log('Usuario confirmó alerta de ingreso');
                        setShowEntryAlert(false);
                        setIsBlocked(false);
                    });
                } else {
                    console.log(' No hay ingresos pendientes, se puede proceder');
                }
            } else if (modalType === 'salida') {
                console.log(' Modo SALIDA - Buscando ingresos activos...');

                // Verificar si hay un ingreso activo (sin salida)
                const registrosDelElemento = historyData.filter(h => h.equipos_o_elementos_id === scannedElement.id);
                console.log(' Registros del elemento:', registrosDelElemento);

                const hasActiveEntry = historyData.some(h => {
                    const isThisElement = h.equipos_o_elementos_id === scannedElement.id;
                    const noSalida = !h.salida || h.salida === null || h.salida === '';
                    console.log(' Verificando registro:', {
                        id: h.id,
                        equipos_o_elementos_id: h.equipos_o_elementos_id,
                        scannedElementId: scannedElement.id,
                        isThisElement,
                        salida: h.salida,
                        tipoSalida: typeof h.salida,
                        noSalida,
                        match: isThisElement && noSalida
                    });
                    return isThisElement && noSalida;
                });

                console.log(' Salida - hasActiveEntry:', hasActiveEntry);

                if (!hasActiveEntry) {
                    console.log(' ALERTA DE SALIDA ACTIVADA - No hay entrada activa');
                    setExitAlertMessage('El elemento no tiene un historial activo previo. No se le hizo ingreso.');
                    setShowExitAlert(true);
                    setIsBlocked(true);
                    setOnConfirmExit(() => () => {
                        console.log('Usuario confirmó alerta de salida');
                        setShowExitAlert(false);
                        setIsBlocked(false);
                    });
                } else {
                    console.log(' Hay entrada activa, se puede dar salida');
                }
            }
        } else {
            console.log(' Condiciones NO cumplidas:', {
                faltaUser: !scannedUser,
                faltaElement: !scannedElement,
                faltaHistory: !historyData,
                historyDataEsArray: Array.isArray(historyData),
                valorHistoryData: historyData
            });
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
                    console.warn('Error al limpiar el escáner QR:', error);
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

                setScannedData(decodedText);
                if (!decodedText || decodedText.trim() === '') {
                    console.error('El código escaneado está vacío o inválido');
                    setShowAlert(true);
                    return;
                }

                const matchedUser = usersData?.find((user: users | null) => user !== null && user.documento === decodedText);
                const matchedElement = elementsData?.find((element: elements | null) => element !== null && element.qr_hash === decodedText);

                if (matchedUser && matchedElement) {
                    alert('El código coincide con un usuario y un elemento. No se puede determinar cuál escanear.');
                    return;
                }

                if (!matchedUser && !matchedElement) {
                    alert('Código no encontrado en usuarios ni elementos.');
                    return;
                }

                if (matchedUser) {
                    // Si ya hay un usuario escaneado, no sobrescribir
                    if (scannedUser) {
                        alert('Ya hay un usuario escaneado. Límpielo primero si desea escanear otro.');
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
                        alert('Ya hay un elemento escaneado. Límpielo primero si desea escanear otro.');
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
                        console.log('Escáner QR inicializado correctamente');
                    } catch (error) {
                        console.error('Error al iniciar el escáner QR:', error);
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
                                    <div style={{ marginBottom: '15px', position: 'relative' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
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
                                        <Typography>Nombre: {scannedUser.nombre} {scannedUser.apellido}</Typography>
                                        <Typography>Documento: {scannedUser.documento}</Typography>
                                    </div>
                                )}
                                {scannedElement && (
                                    <div style={{ marginBottom: '15px', position: 'relative' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '8px'
                                        }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
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
                                        <Typography>Nombre: {scannedElement.tipo_elemento}</Typography>
                                        <Typography>Serie: {scannedElement.sn_equipo}</Typography>
                                        <Typography>Descripción: {scannedElement.descripcion}</Typography>
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
                        disabled={!(scannedUser && scannedElement) || isBlocked} style={{
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
                    <Typography sx={{
                        mt: 2,
                        fontSize: '0.95rem',
                        color: '#666'
                    }}>
                        El elemento que intenta ingresar ya tiene un registro de entrada sin salida correspondiente.
                        Esto puede indicar que el elemento nunca salió del sistema o que hay un error en el registro anterior.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{
                    backgroundColor: '#ffebee',
                    justifyContent: 'center',
                    pb: 3
                }}>
                    <Button
                        onClick={() => {
                            if (onConfirmEntry) onConfirmEntry();
                        }}
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
                    <Typography sx={{
                        mt: 2,
                        fontSize: '0.95rem',
                        color: '#666'
                    }}>
                        El elemento que intenta dar de salida no tiene un registro de entrada activo en el sistema.
                        No se puede registrar una salida sin un ingreso previo correspondiente.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{
                    backgroundColor: '#fff3e0',
                    justifyContent: 'center',
                    pb: 3
                }}>
                    <Button
                        onClick={() => {
                            if (onConfirmExit) onConfirmExit();
                        }}
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
