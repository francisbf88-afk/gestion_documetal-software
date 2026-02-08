import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    Box,
    Card,
    CardContent,
    Avatar,
    Chip,
    LinearProgress,
    useTheme,
    alpha
} from '@mui/material';
import {
    Description as DocumentIcon,
    People as PeopleIcon,
    Assessment as StatsIcon,
    TrendingUp as TrendingUpIcon,
    CloudUpload as CloudUploadIcon,
    Folder as FolderIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const fetchStats = async () => {
            if (isAdmin) {
                try {
                    const response = await axios.get('/api/metadata/estadisticas');
                    setStats(response.data);
                } catch (error) {
                    console.error('Error al obtener estadísticas:', error);
                }
            }
            setLoading(false);
        };

        fetchStats();
    }, [isAdmin]);

    const StatCard = ({ title, value, icon, color = 'primary', trend, subtitle }) => (
        <Box 
            sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                height: '100%'
            }}
        >
            {/* Círculo principal */}
            <Box
                sx={{
                    width: { xs: 140, sm: 160, md: 180 },
                    height: { xs: 140, sm: 160, md: 180 },
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.15)} 0%, ${alpha(theme.palette[color].main, 0.08)} 100%)`,
                    border: `3px solid ${alpha(theme.palette[color].main, 0.3)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: `0 12px 24px ${alpha(theme.palette[color].main, 0.4)}`,
                        border: `3px solid ${alpha(theme.palette[color].main, 0.5)}`,
                    }
                }}
            >
                {/* Icono en la parte superior del círculo */}
                <Avatar
                    sx={{
                        bgcolor: theme.palette[color].main,
                        width: { xs: 36, md: 44 },
                        height: { xs: 36, md: 44 },
                        mb: 1,
                        boxShadow: `
                            0 4px 12px ${alpha(theme.palette[color].main, 0.4)},
                            0 0 20px ${alpha(theme.palette[color].main, 0.3)}
                        `,
                        border: `2px solid ${alpha(theme.palette.common.white, 0.9)}`,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: `
                                0 6px 16px ${alpha(theme.palette[color].main, 0.5)},
                                0 0 30px ${alpha(theme.palette[color].main, 0.4)}
                            `,
                        }
                    }}
                >
                    {icon}
                </Avatar>
                
                {/* Valor principal */}
                <Typography 
                    variant="h2" 
                    sx={{ 
                        fontWeight: 800, 
                        color: theme.palette[color].main, 
                        mb: 0.5,
                        fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                        lineHeight: 1,
                        textShadow: `0 2px 8px ${alpha(theme.palette[color].main, 0.3)}`,
                        filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))'
                    }}
                >
                    {value}
                </Typography>
                
                {/* Título */}
                <Typography 
                    variant="body2" 
                    sx={{ 
                        fontWeight: 600, 
                        color: theme.palette[color].main,
                        fontSize: { xs: '0.65rem', md: '0.75rem' },
                        lineHeight: 1.2,
                        maxWidth: { xs: '100px', md: '120px' },
                        px: 1,
                        textShadow: `0 1px 4px ${alpha(theme.palette[color].main, 0.2)}`
                    }}
                >
                    {title}
                </Typography>

                {/* Trend badge en la esquina superior derecha */}
                {trend && (
                    <Chip
                        icon={<TrendingUpIcon />}
                        label={trend}
                        size="small"
                        color={color}
                        variant="filled"
                        sx={{
                            position: 'absolute',
                            top: -12,
                            right: -12,
                            fontSize: '0.7rem',
                            height: 28,
                            zIndex: 3,
                            boxShadow: `
                                0 4px 12px ${alpha(theme.palette[color].main, 0.4)},
                                0 0 20px ${alpha(theme.palette[color].main, 0.3)}
                            `,
                            border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: `
                                    0 6px 16px ${alpha(theme.palette[color].main, 0.5)},
                                    0 0 30px ${alpha(theme.palette[color].main, 0.4)}
                                `,
                            }
                        }}
                    />
                )}
            </Box>
            
            {/* Subtítulo debajo del círculo */}
            {subtitle && (
                <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                        mt: 2, 
                        textAlign: 'center',
                        maxWidth: { xs: '140px', md: '160px' },
                        lineHeight: 1.3,
                        fontSize: { xs: '0.7rem', md: '0.75rem' }
                    }}
                >
                    {subtitle}
                </Typography>
            )}
        </Box>
    );

    const ActionCard = ({ title, description, icon, onClick, color = 'primary', disabled = false }) => (
        <Card 
            sx={{ 
                cursor: disabled ? 'not-allowed' : 'pointer',
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                opacity: disabled ? 0.6 : 1,
                minHeight: { xs: '140px', sm: '160px' },
                borderRadius: 0, // Sin bordes redondeados
                '&:hover': disabled ? {} : {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                    '& .action-icon': {
                        transform: 'scale(1.1)',
                        color: theme.palette[color].main,
                    }
                }
            }} 
            onClick={disabled ? undefined : onClick}
        >
            <CardContent sx={{ 
                p: { xs: 1, sm: 1.5 }, 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
            }}>
                <Avatar
                    className="action-icon"
                    sx={{
                        bgcolor: alpha(theme.palette[color].main, 0.1),
                        color: theme.palette[color].main,
                        width: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                        mx: 'auto',
                        mb: { xs: 0.5, sm: 1 },
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    {icon}
                </Avatar>
                <Typography 
                    variant="subtitle2" 
                    sx={{ 
                        fontWeight: 600, 
                        mb: 0.5, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }, 
                        lineHeight: 1.2 
                    }}
                >
                    {title}
                </Typography>
                <Typography 
                    color="text.secondary" 
                    variant="caption" 
                    sx={{ 
                        fontSize: { xs: '0.65rem', sm: '0.7rem' }, 
                        lineHeight: 1.2,
                        display: { xs: 'none', sm: 'block' } // Ocultar descripción en móvil
                    }}
                >
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );

    return (
        <Layout>
            <Box sx={{ 
                width: '100%', 
                maxWidth: '1400px', 
                mx: 'auto',
                px: { xs: 1, sm: 2, md: 3 },
                py: { xs: 2, sm: 3 }
            }}>
                {/* Header con bienvenida */}
                <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: 'center' }}>
                    <Typography 
                        variant="h2" 
                        sx={{ 
                            fontWeight: 700, 
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                        }}
                    >
                        ¡Bienvenido, {user?.nombre}!
                    </Typography>
                </Box>

                {/* Estadísticas (solo para admin) */}
                {isAdmin && (
                    <Box mb={{ xs: 3, md: 4 }}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                fontWeight: 600, 
                                mb: 3,
                                fontSize: { xs: '1.5rem', md: '2rem' },
                                textAlign: 'center'
                            }}
                        >
                            📊 Estadísticas del Sistema
                        </Typography>
                        {loading ? (
                            <Box sx={{ mb: 4 }}>
                                <LinearProgress sx={{ borderRadius: 1, height: 6 }} />
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                                    Cargando estadísticas...
                                </Typography>
                            </Box>
                        ) : stats ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                                <Grid 
                                    container 
                                    spacing={{ xs: 2, md: 4 }}
                                    sx={{ 
                                        maxWidth: '1000px',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Grid item xs={6} sm={6} md={3}>
                                        <StatCard
                                            title="Total Documentos"
                                            value={stats.totalDocumentos}
                                            icon={<DocumentIcon />}
                                            color="primary"
                                            trend="+12%"
                                            subtitle="Documentos en el sistema"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={3}>
                                        <StatCard
                                            title="Total Usuarios"
                                            value={stats.totalUsuarios}
                                            icon={<PeopleIcon />}
                                            color="secondary"
                                            trend="+5%"
                                            subtitle="Usuarios registrados"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={3}>
                                        <StatCard
                                            title="Alta Prioridad"
                                            value={stats.documentosPorImportancia?.find(i => i.nivel === 'Alta')?.cantidad || 0}
                                            icon={<StatsIcon />}
                                            color="error"
                                            subtitle="Documentos críticos"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={3}>
                                        <StatCard
                                            title="Tipos Activos"
                                            value={stats.documentosPorTipo?.length || 0}
                                            icon={<DocumentIcon />}
                                            color="success"
                                            subtitle="Categorías disponibles"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        ) : null}
                    </Box>
                )}

                {/* Acciones rápidas */}
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 600, 
                        mb: 3,
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        textAlign: 'center'
                    }}
                >
                    🚀 Acciones Rápidas
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 3, md: 4 } }}>
                    <Grid 
                        container 
                        spacing={{ xs: 1, sm: 2 }}
                        sx={{ 
                            maxWidth: '1000px',
                            justifyContent: 'center',
                            alignItems: 'stretch'
                        }}
                    >
                        <Grid item xs={6} sm={3} md={3}>
                            <ActionCard
                                title="Explorar Documentos"
                                description="Navegar y gestionar documentos"
                                icon={<DocumentIcon />}
                                onClick={() => navigate('/documents')}
                                color="primary"
                            />
                        </Grid>
                        
                        <Grid item xs={6} sm={3} md={3}>
                            <ActionCard
                                title="Subir Documentos"
                                description="Agregar nuevos documentos"
                                icon={<CloudUploadIcon />}
                                onClick={() => navigate('/upload')}
                                color="success"
                                disabled={!isAdmin && user?.rol !== 'editor'}
                            />
                        </Grid>

                        <Grid item xs={6} sm={3} md={3}>
                            <ActionCard
                                title="Gestionar Usuarios"
                                description="Administrar usuarios y roles"
                                icon={<PeopleIcon />}
                                onClick={() => navigate('/users')}
                                color="secondary"
                                disabled={!isAdmin}
                            />
                        </Grid>

                        <Grid item xs={6} sm={3} md={3}>
                            <ActionCard
                                title="Gestionar Categorías"
                                description="Organizar por categorías"
                                icon={<FolderIcon />}
                                onClick={() => navigate('/categories')}
                                color="info"
                                disabled={!isAdmin}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Layout>
    );
};

export default Dashboard;