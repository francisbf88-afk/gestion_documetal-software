import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';

const TestConnection = () => {
    const [status, setStatus] = useState('testing');
    const [message, setMessage] = useState('');
    const [details, setDetails] = useState('');

    const testConnection = async () => {
        setStatus('testing');
        setMessage('Probando conexión...');
        setDetails('');

        try {
            // Probar salud del servidor
            console.log('Testing server health...');
            const healthResponse = await axios.get('/api/health');
            console.log('Health response:', healthResponse.data);

            // Probar login
            console.log('Testing login...');
            const loginResponse = await axios.post('/api/auth/login', {
                username: 'admin',
                password: 'admin123'
            });
            console.log('Login response:', loginResponse.data);

            const token = loginResponse.data.token;

            // Probar categorías
            console.log('Testing categories...');
            const categoriesResponse = await axios.get('/api/categories', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Categories response:', categoriesResponse.data);

            setStatus('success');
            setMessage('¡Conexión exitosa!');
            setDetails(`
                ✅ Servidor: ${healthResponse.data.message}
                ✅ Login: Token obtenido
                ✅ Categorías: ${categoriesResponse.data.length} categorías encontradas
            `);

        } catch (error) {
            console.error('Connection test failed:', error);
            setStatus('error');
            setMessage('Error de conexión');
            setDetails(`
                ❌ Error: ${error.message}
                📍 URL: ${error.config?.url || 'N/A'}
                📊 Status: ${error.response?.status || 'N/A'}
                📝 Response: ${JSON.stringify(error.response?.data || 'No response')}
            `);
        }
    };

    useEffect(() => {
        testConnection();
    }, []);

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                Prueba de Conexión Backend
            </Typography>

            {status === 'testing' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CircularProgress size={24} />
                    <Typography>{message}</Typography>
                </Box>
            )}

            {status === 'success' && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}

            {status === 'error' && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}

            {details && (
                <Box sx={{ 
                    bgcolor: 'grey.100', 
                    p: 2, 
                    borderRadius: 1, 
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-line',
                    mb: 2
                }}>
                    {details}
                </Box>
            )}

            <Button 
                variant="contained" 
                onClick={testConnection}
                disabled={status === 'testing'}
            >
                Probar Conexión Nuevamente
            </Button>
        </Box>
    );
};

export default TestConnection;