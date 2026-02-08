import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Box,
    Chip,
    Divider,
    Badge,
    Tooltip,
    Alert,
    CircularProgress,
    useTheme,
    alpha
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    MarkEmailRead as MarkEmailReadIcon,
    DoneAll as DoneAllIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios';

const NotificationCenter = ({ open, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [unreadOnly, setUnreadOnly] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        if (open) {
            fetchNotifications(1, true);
        }
    }, [open, unreadOnly]);

    const fetchNotifications = async (pageNum = 1, reset = false) => {
        try {
            setLoading(true);
            const response = await axios.get('/api/notifications', {
                params: {
                    page: pageNum,
                    limit: 20,
                    unread_only: unreadOnly
                }
            });

            const newNotifications = response.data.notificaciones;
            
            if (reset) {
                setNotifications(newNotifications);
            } else {
                setNotifications(prev => [...prev, ...newNotifications]);
            }
            
            setPage(pageNum);
            setHasMore(pageNum < response.data.pagination.pages);
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(`/api/notifications/${notificationId}/read`);
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === notificationId 
                        ? { ...notif, leida: true, fecha_lectura: new Date().toISOString() }
                        : notif
                )
            );
        } catch (error) {
            console.error('Error al marcar como leída:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put('/api/notifications/read-all');
            setNotifications(prev => 
                prev.map(notif => ({ 
                    ...notif, 
                    leida: true, 
                    fecha_lectura: new Date().toISOString() 
                }))
            );
        } catch (error) {
            console.error('Error al marcar todas como leídas:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete(`/api/notifications/${notificationId}`);
            setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        } catch (error) {
            console.error('Error al eliminar notificación:', error);
        }
    };

    const getNotificationIcon = (tipo) => {
        switch (tipo) {
            case 'documento_editado':
                return <EditIcon color="warning" />;
            case 'documento_creado':
                return <AddIcon color="success" />;
            case 'documento_eliminado':
                return <DeleteIcon color="error" />;
            default:
                return <InfoIcon color="info" />;
        }
    };

    const getNotificationColor = (tipo) => {
        switch (tipo) {
            case 'documento_editado':
                return 'warning';
            case 'documento_creado':
                return 'success';
            case 'documento_eliminado':
                return 'error';
            default:
                return 'info';
        }
    };

    const formatTimeAgo = (fecha) => {
        try {
            return formatDistanceToNow(new Date(fecha), { 
                addSuffix: true, 
                locale: es 
            });
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    const unreadCount = notifications.filter(n => !n.leida).length;

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    maxHeight: '80vh'
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                pb: 1
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                    <Typography variant="h6">
                        Centro de Notificaciones
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                {/* Controles */}
                <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant={unreadOnly ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => {
                                setUnreadOnly(!unreadOnly);
                                setPage(1);
                            }}
                        >
                            {unreadOnly ? 'Ver todas' : 'Solo no leídas'}
                        </Button>
                        
                        {unreadCount > 0 && (
                            <Tooltip title="Marcar todas como leídas">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<DoneAllIcon />}
                                    onClick={markAllAsRead}
                                >
                                    Marcar todas
                                </Button>
                            </Tooltip>
                        )}
                        
                        <Chip 
                            label={`${notifications.length} notificaciones`} 
                            size="small" 
                            variant="outlined" 
                        />
                    </Box>
                </Box>

                {/* Lista de notificaciones */}
                <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                    {loading && notifications.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : notifications.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No hay notificaciones
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {unreadOnly ? 'No tienes notificaciones sin leer' : 'Aún no has recibido notificaciones'}
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ p: 0 }}>
                            {notifications.map((notification, index) => (
                                <React.Fragment key={notification.id}>
                                    <ListItem
                                        sx={{
                                            backgroundColor: notification.leida 
                                                ? 'transparent' 
                                                : alpha(theme.palette.primary.main, 0.05),
                                            borderLeft: notification.leida 
                                                ? 'none' 
                                                : `4px solid ${theme.palette[getNotificationColor(notification.tipo)].main}`,
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.action.hover, 0.5)
                                            }
                                        }}
                                    >
                                        <ListItemIcon>
                                            {getNotificationIcon(notification.tipo)}
                                        </ListItemIcon>
                                        
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                    <Typography 
                                                        variant="subtitle2" 
                                                        sx={{ 
                                                            fontWeight: notification.leida ? 400 : 600,
                                                            flex: 1
                                                        }}
                                                    >
                                                        {notification.titulo}
                                                    </Typography>
                                                    <Chip
                                                        label={notification.tipo.replace('documento_', '')}
                                                        size="small"
                                                        color={getNotificationColor(notification.tipo)}
                                                        variant="outlined"
                                                        sx={{ fontSize: '0.7rem' }}
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography 
                                                        variant="body2" 
                                                        color="text.secondary"
                                                        sx={{ mb: 0.5 }}
                                                    >
                                                        {notification.mensaje}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatTimeAgo(notification.fecha_creacion)}
                                                        </Typography>
                                                        {notification.usuario_origen && (
                                                            <>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    •
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    por {notification.usuario_origen}
                                                                </Typography>
                                                            </>
                                                        )}
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                        
                                        <ListItemSecondaryAction>
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                {!notification.leida && (
                                                    <Tooltip title="Marcar como leída">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => markAsRead(notification.id)}
                                                        >
                                                            <MarkEmailReadIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Eliminar">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => deleteNotification(notification.id)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    {index < notifications.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                    
                    {/* Cargar más */}
                    {hasMore && notifications.length > 0 && (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Button
                                onClick={() => fetchNotifications(page + 1, false)}
                                disabled={loading}
                                variant="outlined"
                                size="small"
                            >
                                {loading ? <CircularProgress size={20} /> : 'Cargar más'}
                            </Button>
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="contained">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NotificationCenter;