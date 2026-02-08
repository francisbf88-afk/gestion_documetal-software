import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    Grid,
    Card,
    CardContent,
    Avatar,
    useTheme,
    alpha
} from '@mui/material';
import {
    Info as InfoIcon,
    Security as SecurityIcon,
    Support as SupportIcon,
    Description as DocumentIcon,
    Shield as ShieldIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
import Layout from './Layout';

const Help = () => {
    const theme = useTheme();

    const HelpSection = ({ title, icon, color, children }) => (
        <Paper 
            sx={{ 
                p: { xs: 2, sm: 3, md: 4 },
                mb: 4,
                borderRadius: 0,
                background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.05)} 0%, ${alpha(theme.palette[color].main, 0.02)} 100%)`,
                border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                gap: 2
            }}>
                <Avatar
                    sx={{
                        bgcolor: theme.palette[color].main,
                        width: { xs: 48, md: 56 },
                        height: { xs: 48, md: 56 },
                    }}
                >
                    {icon}
                </Avatar>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        color: theme.palette[color].main
                    }}
                >
                    {title}
                </Typography>
            </Box>
            {children}
        </Paper>
    );

    return (
        <Layout>
            <Box sx={{ 
                width: '100%', 
                maxWidth: '1200px', 
                mx: 'auto',
                px: { xs: 1, sm: 2, md: 3 },
                py: { xs: 2, sm: 3 }
            }}>
                {/* Header */}
                <Box sx={{ mb: { xs: 3, md: 4 }, textAlign: 'center' }}>
                    <Typography 
                        variant="h2" 
                        sx={{ 
                            fontWeight: 700, 
                            mb: 2,
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                        }}
                    >
                        📚 Centro de Ayuda
                    </Typography>
                    <Typography 
                        variant="h6" 
                        color="text.secondary"
                        sx={{ 
                            fontSize: { xs: '1rem', md: '1.25rem' },
                            maxWidth: '600px',
                            mx: 'auto'
                        }}
                    >
                        Encuentra toda la información que necesitas sobre el sistema de gestión documental
                    </Typography>
                </Box>

                {/* Información del Sistema */}
                <HelpSection 
                    title="Información del Sistema" 
                    icon={<InfoIcon />} 
                    color="primary"
                >
                    <Typography variant="body1" sx={{ mb: 3, fontSize: { xs: '0.95rem', md: '1rem' } }}>
                        Este es un sistema de gestión documental completo que permite organizar, 
                        almacenar y gestionar documentos de manera eficiente y profesional.
                    </Typography>
                    
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Características Principales:
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ height: '100%', borderRadius: 0 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <DocumentIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Gestión Completa
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Administración integral de documentos con metadatos detallados
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ height: '100%', borderRadius: 0 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <ShieldIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Control de Acceso
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Sistema de roles y permisos granulares
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                        <li>Organización por categorías personalizables</li>
                        <li>Editor integrado para documentos de texto</li>
                        <li>Historial completo de cambios y auditoría</li>
                        <li>Interfaz responsive para todos los dispositivos</li>
                        <li>Búsqueda avanzada y filtros inteligentes</li>
                        <li>Descarga y visualización optimizada</li>
                        <li>Gestión de usuarios y permisos</li>
                        <li>Estadísticas y reportes del sistema</li>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Roles del Sistema:
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item>
                                <Chip
                                    label="Administrador - Control total"
                                    color="error"
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item>
                                <Chip
                                    label="Editor - Gestión de contenido"
                                    color="warning"
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item>
                                <Chip
                                    label="Asesor - Solo lectura"
                                    color="info"
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </HelpSection>

                {/* Seguridad y Privacidad */}
                <HelpSection 
                    title="Seguridad y Privacidad" 
                    icon={<SecurityIcon />} 
                    color="error"
                >
                    <Typography variant="body1" sx={{ mb: 3, fontSize: { xs: '0.95rem', md: '1rem' } }}>
                        La seguridad es una prioridad absoluta en nuestro sistema. Implementamos las mejores 
                        prácticas de seguridad para proteger tus documentos y datos confidenciales.
                    </Typography>

                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Medidas de Seguridad Implementadas:
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                                <li><strong>Autenticación JWT:</strong> Tokens seguros con expiración automática</li>
                                <li><strong>Encriptación de contraseñas:</strong> Algoritmo bcrypt de alta seguridad</li>
                                <li><strong>Control granular:</strong> Permisos específicos por documento</li>
                                <li><strong>Auditoría completa:</strong> Registro de todas las acciones del sistema</li>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                                <li><strong>Base de datos segura:</strong> PostgreSQL con conexión encriptada</li>
                                <li><strong>Validación de entrada:</strong> Sanitización en backend y frontend</li>
                                <li><strong>Sesiones seguras:</strong> Gestión automática de timeouts</li>
                                <li><strong>Backup automático:</strong> Respaldo regular de datos</li>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ 
                        p: 2, 
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                        borderRadius: 1,
                        mt: 3
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'error.main' }}>
                            🔒 Compromiso de Privacidad
                        </Typography>
                        <Typography variant="body2">
                            • Todos los documentos están protegidos con cifrado de nivel empresarial<br/>
                            • No compartimos información con terceros sin autorización<br/>
                            • Cumplimos con estándares internacionales de protección de datos<br/>
                            • Los usuarios solo acceden a documentos según sus permisos asignados
                        </Typography>
                    </Box>
                </HelpSection>

                {/* Soporte y Contacto */}
                <HelpSection 
                    title="Soporte y Contacto" 
                    icon={<SupportIcon />} 
                    color="success"
                >
                    <Typography variant="body1" sx={{ mb: 3, fontSize: { xs: '0.95rem', md: '1rem' } }}>
                        Nuestro equipo de soporte está disponible para ayudarte con cualquier consulta 
                        o problema que puedas tener con el sistema.
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', borderRadius: 0 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PhoneIcon color="success" sx={{ mr: 1 }} />
                                        <Typography variant="h6" fontWeight={600}>
                                            Información de Contacto
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                        PROCOVAR S.R.L
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Sistema de Gestión Documental Profesional
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Especialistas en:</strong><br/>
                                        • Gestión documental empresarial<br/>
                                        • Sistemas de archivo digital<br/>
                                        • Consultoría en organización documental<br/>
                                        • Soporte técnico especializado
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', borderRadius: 0 }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                                        ¿Cómo podemos ayudarte?
                                    </Typography>
                                    <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                                        <li>Problemas técnicos del sistema</li>
                                        <li>Consultas sobre funcionalidades</li>
                                        <li>Solicitudes de nuevas características</li>
                                        <li>Capacitación de usuarios</li>
                                        <li>Configuración de permisos</li>
                                        <li>Migración de documentos</li>
                                        <li>Optimización del sistema</li>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', borderRadius: 0, background: alpha(theme.palette.primary.main, 0.05) }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>
                                            👨‍💻
                                        </Avatar>
                                        <Typography variant="h6" fontWeight={600} color="primary.main">
                                            Desarrollador de Software
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                        Francisco Blanco Fis (Francis)
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Especializado en el desarrollo de Sistemas Informáticos
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                📧 Email:
                                            </Typography>
                                            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                                                francisbf88@gmail.com
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                📱 Móvil:
                                            </Typography>
                                            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                                                +53 597-894-52
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Box sx={{ 
                        p: 3, 
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                        borderRadius: 1,
                        mt: 3,
                        textAlign: 'center'
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'success.main' }}>
                            💡 Consejos para un Mejor Uso
                        </Typography>
                        <Typography variant="body2">
                            • Organiza tus documentos por categorías desde el inicio<br/>
                            • Utiliza nombres descriptivos para facilitar las búsquedas<br/>
                            • Revisa regularmente los permisos de acceso<br/>
                            • Mantén actualizada la información de contacto de los usuarios
                        </Typography>
                    </Box>
                </HelpSection>
            </Box>
        </Layout>
    );
};

export default Help;