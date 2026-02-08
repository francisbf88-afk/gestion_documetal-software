import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Divider,
    Chip
} from '@mui/material';
import {
    AccountCircle as AccountIcon,
    Lock as LockIcon,
    Business as BusinessIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import ParticlesBackground from './ParticlesBackground';



const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(username, password);
        
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
        
        setLoading(false);
    };

    const testUsers = [
        { role: 'Administrador', username: 'admin', password: 'admin123', color: 'error' },
        { role: 'Editor', username: 'editor', password: 'editor123', color: 'warning' },
        { role: 'Asesor', username: 'asesor', password: 'asesor123', color: 'info' }
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `
                    linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(30, 64, 175, 0.8) 100%),
                    url('/fondo.png')
                `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <ParticlesBackground />
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        flexWrap: 'wrap'
                    }}
                >
                    {/* Panel de Bienvenida */}
                    <Card
                        sx={{
                            maxWidth: 400,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <BusinessIcon 
                                    sx={{ 
                                        fontSize: 60, 
                                        color: 'primary.main',
                                        mb: 2
                                    }} 
                                />
                                <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                                    Sistema Archivístico
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                                    Gestión Documental Profesional
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
                                Características Principales
                            </Typography>
                            
                            <Box sx={{ mb: 3 }}>
                                {[
                                    '📁 Gestión completa de documentos',
                                    '🔒 Control de acceso por roles',
                                    '📊 Dashboard con estadísticas',
                                    '🔍 Búsqueda avanzada',
                                    '📝 Editor integrado',
                                    '🔗 Apertura en editores externos'
                                ].map((feature, index) => (
                                    <Typography 
                                        key={index}
                                        variant="body2" 
                                        sx={{ 
                                            mb: 1, 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            color: 'text.secondary'
                                        }}
                                    >
                                        {feature}
                                    </Typography>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Panel de Login */}
                    <Card
                        sx={{
                            maxWidth: 450,
                            background: 'rgba(255, 255, 255, 0.98)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: '0 35px 60px -12px rgba(0, 0, 0, 0.3)'
                            }
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <AccountIcon 
                                    sx={{ 
                                        fontSize: 48, 
                                        color: 'secondary.main',
                                        mb: 2
                                    }} 
                                />
                                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                                    Iniciar Sesión
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Accede a tu cuenta para continuar
                                </Typography>
                            </Box>
                            
                            {error && (
                                <Alert 
                                    severity="error" 
                                    sx={{ 
                                        mb: 3,
                                        borderRadius: 2,
                                        '& .MuiAlert-message': {
                                            fontSize: '0.9rem'
                                        }
                                    }}
                                >
                                    {error}
                                </Alert>
                            )}

                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Nombre de Usuario"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <AccountIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Contraseña"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <LockIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                        ),
                                    }}
                                    sx={{ mb: 3 }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    sx={{ 
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
                                        }
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Iniciar Sesión'
                                    )}
                                </Button>
                            </Box>

                            <Divider sx={{ my: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Usuarios de Prueba
                                </Typography>
                            </Divider>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {testUsers.map((user, index) => (
                                    <Paper
                                        key={index}
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                elevation: 3,
                                                transform: 'translateY(-1px)',
                                                backgroundColor: 'grey.50'
                                            }
                                        }}
                                        onClick={() => {
                                            setUsername(user.username);
                                            setPassword(user.password);
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {user.role}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {user.username} / {user.password}
                                                </Typography>
                                            </Box>
                                            <Chip 
                                                label={user.role} 
                                                color={user.color} 
                                                size="small" 
                                                variant="outlined"
                                            />
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>

                            <Typography 
                                variant="caption" 
                                display="block" 
                                align="center" 
                                sx={{ mt: 3, color: 'text.secondary' }}
                            >
                                Haz clic en cualquier usuario para autocompletar los campos
                            </Typography>
                        </CardContent>
                    </Card>
            </Box>
        </Container>
    </Box>
);
};

export default Login;