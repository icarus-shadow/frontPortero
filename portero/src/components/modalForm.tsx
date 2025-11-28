import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem,
    Grid, Typography, FormControl, InputLabel, Alert, Button
} from "@mui/material";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useAppSelector } from '../services/redux/hooks.tsx';
import type { users, elements } from '../types/interfacesData.tsx';

// =============================
// Types
// =============================
export type FieldConfig = {
    name: string;
    label: string;
    type: "text" | "number" | "email" | "textarea" | "select" | "file";
    placeholder?: string;
    required?: boolean;
    options?: { label: string; value: any }[];
    accept?: string;
    maxSize?: number; // en KB
} | {
    name?: string;
    label: string;
    type: "button";
    onClick?: () => void;
    required?: boolean;
    maxSize?: number;
};

interface ModalFormProps {
    isOpen: boolean;
    title: string;
    fields?: FieldConfig[];
    leftFields?: FieldConfig[];
    rightFields?: FieldConfig[];
    leftTitle?: string;
    rightTitle?: string;
    initialValue?: Record<string, any>;
    onClose: () => void;
    onSubmit: (data: Record<string, any>) => void;
    customButton?: { label: string; action: () => void; variant?: 'primary' | 'secondary' };
    bannerMessage?: string;
    bannerSeverity?: 'success' | 'info' | 'warning' | 'error';
    modalType?: 'ingreso' | 'salida' | 'usuario' | 'elemento' | null;
}

// =============================
// Reusable Modal Form Component
// =============================
const ModalForm: React.FC<ModalFormProps> = ({
    isOpen,
    title,
    fields,
    leftFields,
    rightFields,
    leftTitle,
    rightTitle,
    initialValue = {},
    onClose,
    onSubmit,
    bannerMessage,
    bannerSeverity,
    modalType
}) => {
    const effectiveLeftFields = leftFields || (fields ? fields.slice(0, Math.ceil(fields.length / 2)) : []);
    const effectiveRightFields = rightFields || (fields ? fields.slice(Math.ceil(fields.length / 2)) : []);
    const effectiveLeftTitle = leftTitle || 'Campos Izquierda';
    const effectiveRightTitle = rightTitle || 'Campos Derecha';

    const [formData, setFormData] = useState<Record<string, any>>(initialValue);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const prevInitialValuesRef = useRef<Record<string, any> | null>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const html5QrcodeScannerRef = useRef<Html5QrcodeScanner | null>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const [hasScanned, setHasScanned] = useState<boolean>(false);
    const [scannedUser, setScannedUser] = useState<users | null>(null);
    const [scannedElement, setScannedElement] = useState<elements | null>(null);
    const [showOwnershipAlert, setShowOwnershipAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);

    const usersData = useAppSelector((state) => state.usersReducer.data);
    const elementsData = useAppSelector((state) => state.elementsReducer.data);

    const resetForm = () => {
        setFormData(initialValue);
        setErrors({});
        setTouched({});
        setIsFormValid(false);
        setShowAlert(false);
        setScannedData(null);
        setHasScanned(false);
        setScannedUser(null);
        setScannedElement(null);
    };

    // Funciones de validación (simplificadas para brevedad, pero funcionales)
    const validateRequired = (value: any, required: boolean): string => {
        if (required && (!value || value.toString().trim() === '')) return 'Este campo es requerido';
        return '';
    };

    const validateField = (_name: string, value: any, field: FieldConfig): string => {
        if (field.type === 'button') return '';
        return validateRequired(value, field.required || false);
    };

    const handleChange = (e: any) => {
        const { name, value, files } = e.target;
        const actualValue = files ? files[0] : value;
        setFormData((prev) => ({ ...prev, [name]: actualValue }));
        setTouched((prev) => ({ ...prev, [name]: true }));

        // Validación básica
        const allFields = [...effectiveLeftFields, ...effectiveRightFields];
        const field = allFields.find((f) => f.name === name);
        if (field) {
            const error = validateField(name, actualValue, field);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validación final antes de enviar
        onSubmit(formData);
        resetForm();
    };


    useEffect(() => {
        if (isOpen && JSON.stringify(initialValue) !== JSON.stringify(prevInitialValuesRef.current)) {
            setFormData(initialValue);
            setErrors({});
            setTouched({});
            setIsFormValid(false);
            setShowAlert(false);
            setScannedData(null);
            setHasScanned(false);
            setScannedUser(null);
            setScannedElement(null);
            prevInitialValuesRef.current = initialValue;
        }
    }, [isOpen, initialValue]);

const isQrMode = modalType === 'ingreso' || modalType === 'salida';
    // Inicializar y limpiar el escáner QR
    useLayoutEffect(() => {
        if (isOpen && isQrMode && !html5QrcodeScannerRef.current) {
            // Función de éxito al escanear
            const onScanSuccess = (decodedText: string) => {
                if (hasScanned) return;
                setHasScanned(true);
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
                    setHasScanned(false);
                    return;
                }

                if (!matchedUser && !matchedElement) {
                    alert('Código no encontrado en usuarios ni elementos.');
                    setHasScanned(false);
                    return;
                }

                if (matchedUser) {
                    if (scannedElement && scannedElement.usuarios.length > 0 && !scannedElement.usuarios.some(user => user.id == matchedUser.id)) {
                        setAlertMessage('El usuario no es propietario del elemento. ¿Confirmar de todos modos?');
                        setOnConfirm(() => () => {
                            setScannedUser(matchedUser);
                            setFormData({ ...formData, codigo: decodedText });
                            alert('Escaneo exitoso.');
                            setShowOwnershipAlert(false);
                        });
                        setShowOwnershipAlert(true);
                        setHasScanned(false);
                        return;
                    } else {
                        setScannedUser(matchedUser);
                    }
                }

                if (matchedElement) {
                    if (scannedUser && scannedUser.id && matchedElement.usuarios.length > 0 && !matchedElement.usuarios.some(user => user.id == scannedUser.id)) {
                        setAlertMessage('El usuario no es propietario del elemento. ¿Confirmar de todos modos?');
                        setOnConfirm(() => () => {
                            setScannedElement(matchedElement);
                            setFormData({ ...formData, codigo: decodedText });
                            alert('Escaneo exitoso.');
                            setShowOwnershipAlert(false);
                        });
                        setShowOwnershipAlert(true);
                        setHasScanned(false);
                        return;
                    } else {
                        setScannedElement(matchedElement);
                    }
                }

                if ((matchedUser || matchedElement) && !showOwnershipAlert) {
                    const newFormData = { ...formData, codigo: decodedText };
                    setFormData(newFormData);
                }
            };

            // Función de fallo al escanear
            const onScanFailure = (error: any) => {
            };

            if (divRef.current) {
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
                    console.error('Error al iniciar el escáner QR:', error);
                }
            }
        }

        return () => {
            if (html5QrcodeScannerRef.current) {
                try {
                    html5QrcodeScannerRef.current.clear();
                } catch (error) {
                    console.warn('Error al detener el escáner QR:', error);
                }
                html5QrcodeScannerRef.current = null;
            }
        };
    }, [isOpen, isQrMode, hasScanned, formData, onSubmit, onClose]);


    const renderField = (field: FieldConfig) => {
        if (field.type === "button") {
            return (
                <FormControl key={field.label} fullWidth sx={{ margin: 1 }}>
                    <button type="button" onClick={field.onClick} className="btn-primary">{field.label}</button>
                </FormControl>
            );
        }
        if (field.type === "select") {
            return (
                <FormControl key={field.name} fullWidth sx={{ margin: 1 }}>
                    <InputLabel>{field.label}</InputLabel>
                    <Select name={field.name} value={formData[field.name] || ""} onChange={handleChange}>
                        {field.options?.map((option) => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }
        return (
            <TextField
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                required={field.required}
                value={formData[field.name] || ""}
                onChange={handleChange}
                fullWidth
                sx={{ margin: 1 }}
            />
        );
    };


    return (
        <><Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth
                  sx={{'& .MuiDialog-paper': {borderRadius: 0}}}>
            <DialogTitle sx={{backgroundColor: 'var(--background)', color: 'var(--text)'}}>{title}</DialogTitle>
            {bannerMessage && <Alert severity={bannerSeverity || 'info'} sx={{margin: 2}}>{bannerMessage}</Alert>}
            <DialogContent sx={{backgroundColor: 'var(--background)', color: 'var(--text)'}}>
                <form onSubmit={handleSubmit}>
                    <Grid sx={{minWidth: 950, justifyContent: 'space-evenly', p: 4}} container spacing={4}>
                        <Grid item md={6} sx={{
                            maxHeight: 500,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            p: 2,
                            backgroundColor: 'rgba(var(--secondary-rgb), 0.2)',
                            borderRadius: 5
                        }}>
                            <Typography variant="h6" sx={{
                                color: 'var(--secondary)',
                                mb: 2,
                                fontWeight: 'bold'
                            }}>{effectiveLeftTitle}</Typography>
                            {isQrMode ? (
                                <>
                                    <div ref={divRef} style={{
                                        width: '100%',
                                        height: '300px',
                                        overflow: 'hidden',
                                        borderRadius: '10px'
                                    }}>
                                    </div>
                                    {hasScanned && (
                                        <button type="button" onClick={() => setHasScanned(false)}
                                                className="btn-secondary" style={{
                                            marginTop: '10px',
                                            backgroundColor: 'var(--secondary)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            transition: 'background-color 0.3s'
                                        }}
                                                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--primary)'}
                                                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--secondary)'}>Escanear
                                            nuevamente</button>
                                    )}
                                </>
                            ) : (
                                effectiveLeftFields.map(renderField)
                            )}
                        </Grid>
                        <Grid item md={6} sx={{
                            maxHeight: 500,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            p: 2,
                            backgroundColor: 'rgba(var(--secondary-rgb), 0.2)',
                            borderRadius: 5
                        }}>
                            <Typography variant="h6" sx={{
                                color: 'var(--secondary)',
                                mb: 2,
                                fontWeight: 'bold'
                            }}>{effectiveRightTitle}</Typography>
                            {scannedUser && (
                                <div style={{marginBottom: '10px'}}>
                                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Usuario
                                        Escaneado:</Typography>
                                    <Typography>Nombre: {scannedUser.nombre} {scannedUser.apellido}</Typography>
                                    <Typography>Documento: {scannedUser.documento}</Typography>
                                </div>
                            )}
                            {scannedElement && (
                                <div style={{marginBottom: '10px'}}>
                                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Elemento
                                        Escaneado:</Typography>
                                    <Typography>Nombre: {scannedElement.tipo_elemento}</Typography>
                                    <Typography>Serie: {scannedElement.sn_equipo}</Typography>
                                    <Typography>Descripción: {scannedElement.descripcion}</Typography>
                                </div>
                            )}
                            {effectiveRightFields.map(renderField)}
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions sx={{backgroundColor: 'var(--background)', justifyContent: 'flex-end', padding: '16px'}}>
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
                        onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--button-cancel-bg)'}>Cancelar
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
                        onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--button-save-bg)'}>{modalType === 'ingreso' ? 'dar ingreso' : modalType === 'salida' ? 'dar salida' : 'Guardar'}</button>
            </DialogActions>
        </Dialog><Dialog open={showOwnershipAlert} onClose={() => setShowOwnershipAlert(false)}>
            <DialogTitle>Confirmación</DialogTitle>
            <DialogContent>
                <Typography>{alertMessage}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowOwnershipAlert(false)}>No</Button>
                <Button onClick={() => {
                    if (onConfirm) onConfirm();
                }}>Sí</Button>
            </DialogActions>
        </Dialog></>
    );
};

export default ModalForm;
