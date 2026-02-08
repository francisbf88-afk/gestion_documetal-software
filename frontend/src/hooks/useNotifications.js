import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useNotifications = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función para obtener el contador de notificaciones no leídas
    const fetchUnreadCount = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/api/notifications/unread-count');
            setUnreadCount(response.data.count);
        } catch (err) {
            console.error('Error al obtener contador de notificaciones:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para marcar una notificación como leída
    const markAsRead = useCallback(async (notificationId) => {
        try {
            await axios.put(`/api/notifications/${notificationId}/read`);
            // Actualizar el contador después de marcar como leída
            await fetchUnreadCount();
            return true;
        } catch (err) {
            console.error('Error al marcar notificación como leída:', err);
            setError(err.message);
            return false;
        }
    }, [fetchUnreadCount]);

    // Función para marcar todas las notificaciones como leídas
    const markAllAsRead = useCallback(async () => {
        try {
            await axios.put('/api/notifications/read-all');
            setUnreadCount(0);
            return true;
        } catch (err) {
            console.error('Error al marcar todas las notificaciones como leídas:', err);
            setError(err.message);
            return false;
        }
    }, []);

    // Función para obtener todas las notificaciones
    const fetchNotifications = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/api/notifications', { params });
            return response.data;
        } catch (err) {
            console.error('Error al obtener notificaciones:', err);
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para eliminar una notificación
    const deleteNotification = useCallback(async (notificationId) => {
        try {
            await axios.delete(`/api/notifications/${notificationId}`);
            // Actualizar el contador después de eliminar
            await fetchUnreadCount();
            return true;
        } catch (err) {
            console.error('Error al eliminar notificación:', err);
            setError(err.message);
            return false;
        }
    }, [fetchUnreadCount]);

    // Efecto para cargar el contador inicial
    useEffect(() => {
        fetchUnreadCount();
    }, [fetchUnreadCount]);

    // Polling para actualizar el contador cada 30 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000); // 30 segundos

        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    return {
        unreadCount,
        loading,
        error,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
        deleteNotification,
        // Función para refrescar manualmente
        refresh: fetchUnreadCount
    };
};