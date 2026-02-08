import React, { useState, useEffect } from 'react';
import {
    Snackbar,
    Alert,
    AlertTitle,
    IconButton,
    Typography,
    Slide
} from '@mui/material';
import {
    Close as CloseIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNotifications } from '../hooks/useNotifications';

const NotificationAlert = () => {
    const [lastNotificationCount, setLastNotificationCount] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('info');
    const { unreadCount } = useNotifications();

    useEffect(() => {
        // Detectar cuando aumenta el contador de notificaciones
        if (unreadCount > lastNotificationCount && lastNotificationCount > 0) {
            const newNotifications = unreadCount - lastNotificationCount;
            
            setAlertMessage(
                newNotifications === 1 
                    ? 'Nueva notificación recibida' 
                    : `${newNotifications} nuevas notificaciones recibidas`
            );
            setAlertSeverity('info');
            setShowAlert(true);
        }
        
        setLastNotificationCount(unreadCount);
    }, [unreadCount, lastNotificationCount]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowAlert(false);
    };

    const getIcon = () => {
        return <VisibilityIcon />;
    };

    return (
        <Snackbar
            open={showAlert}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            TransitionComponent={Slide}
            TransitionProps={{ direction: 'left' }}
            sx={{ 
                mt: 8, // Margen superior para no cubrir el AppBar
                mr: 2  // Margen derecho
            }}
        >
            <Alert
                severity={alertSeverity}
                icon={getIcon()}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{
                    minWidth: '300px',
                    boxShadow: 3,
                    '& .MuiAlert-message': {
                        width: '100%'
                    }
                }}
            >
                <AlertTitle sx={{ fontWeight: 600 }}>
                    Sistema de Alertas
                </AlertTitle>
                <Typography variant="body2">
                    {alertMessage}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Haz clic en el icono de notificaciones para ver los detalles
                </Typography>
            </Alert>
        </Snackbar>
    );
};

export default NotificationAlert;