import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Divider,
    Badge,
    Tooltip,
    useTheme,
    useMediaQuery,
    alpha
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Description as DocumentIcon,
    Upload as UploadIcon,
    People as PeopleIcon,
    ExitToApp,
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
    Business as BusinessIcon,
    ChevronLeft as ChevronLeftIcon,
    Help as HelpIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import Footer from './Footer';
import NotificationCenter from './NotificationCenter';
import NotificationAlert from './NotificationAlert';

const DRAWER_WIDTH = 280;

const Layout = ({ children }) => {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
    const { user, logout } = useAuth();
    const { unreadCount, refresh: refreshNotifications } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Inicializar el drawer abierto por defecto en desktop
    useEffect(() => {
        if (!isMobile) {
            setDesktopDrawerOpen(true);
        }
    }, [isMobile]);

    const handleDrawerToggle = () => {
        if (isMobile) {
            setMobileDrawerOpen(!mobileDrawerOpen);
        } else {
            setDesktopDrawerOpen(!desktopDrawerOpen);
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleMenuClose();
    };

    const menuItems = [
        { 
            text: 'Dashboard', 
            icon: <DashboardIcon />, 
            path: '/dashboard', 
            roles: ['admin', 'asesor', 'editor'],
            description: 'Panel principal con estadísticas'
        },
        { 
            text: 'Documentos', 
            icon: <DocumentIcon />, 
            path: '/documents', 
            roles: ['admin', 'asesor', 'editor'],
            description: 'Gestión de documentos'
        },
        { 
            text: 'Subir Documento', 
            icon: <UploadIcon />, 
            path: '/upload', 
            roles: ['admin', 'editor'],
            description: 'Cargar nuevos documentos'
        },
        { 
            text: 'Usuarios', 
            icon: <PeopleIcon />, 
            path: '/users', 
            roles: ['admin'],
            description: 'Administración de usuarios'
        },
        { 
            text: 'Ayuda', 
            icon: <HelpIcon />, 
            path: '/help', 
            roles: ['admin', 'asesor', 'editor'],
            description: 'Centro de ayuda y soporte'
        }
    ];

    const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.rol));

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return theme.palette.error.main;
            case 'editor': return theme.palette.warning.main;
            case 'asesor': return theme.palette.info.main;
            default: return theme.palette.grey[500];
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin': return 'Administrador';
            case 'editor': return 'Editor';
            case 'asesor': return 'Asesor';
            default: return role;
        }
    };

    const drawer = (
        <Box sx={{ width: DRAWER_WIDTH, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header del Drawer */}
            <Box
                sx={{
                    p: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white',
                    textAlign: 'center',
                    borderRadius: 0 // Sin bordes redondeados
                }}
            >
                <BusinessIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Sistema Archivístico
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Gestión Documental
                </Typography>
            </Box>

            <Divider />

            {/* Información del Usuario */}
            <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                        sx={{ 
                            bgcolor: getRoleColor(user?.rol),
                            width: 40,
                            height: 40,
                            fontSize: '1.2rem',
                            fontWeight: 600
                        }}
                    >
                        {user?.nombre?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                            variant="subtitle2" 
                            sx={{ 
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {user?.nombre}
                        </Typography>
                        <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block'
                            }}
                        >
                            @{user?.username}
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                            <Badge
                                badgeContent={getRoleLabel(user?.rol)}
                                color="primary"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        backgroundColor: getRoleColor(user?.rol),
                                        color: 'white',
                                        fontSize: '0.7rem',
                                        fontWeight: 500,
                                        borderRadius: 1
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Divider />

            {/* Menú de Navegación */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <List sx={{ px: 1, py: 2 }}>
                    {filteredMenuItems.map((item) => (
                        <Tooltip key={item.text} title={item.description} placement="right">
                            <ListItem
                                button
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile) {
                                        setMobileDrawerOpen(false);
                                    }
                                }}
                                selected={location.pathname === item.path}
                                sx={{
                                    borderRadius: 0, // Sin bordes redondeados
                                    mb: 0.5,
                                    mx: 1,
                                    '&.Mui-selected': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: theme.palette.primary.main,
                                        },
                                        '& .MuiListItemText-primary': {
                                            color: theme.palette.primary.main,
                                            fontWeight: 600,
                                        }
                                    },
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: '0.95rem',
                                        fontWeight: location.pathname === item.path ? 600 : 400
                                    }}
                                />
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* AppBar */}
            <AppBar 
                position="fixed" 
                elevation={0}
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                    borderRadius: 0, // Sin bordes redondeados
                    zIndex: theme.zIndex.drawer + 1, // Encima del drawer y del footer
                    width: { 
                        xs: '100%', 
                        md: desktopDrawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' 
                    },
                    ml: { 
                        xs: 0, 
                        md: desktopDrawerOpen ? `${DRAWER_WIDTH}px` : 0 
                    },
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
                    <IconButton
                        color="inherit"
                        aria-label="toggle drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ 
                            mr: 2,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.common.white, 0.1)
                            }
                        }}
                    >
                        {(isMobile ? mobileDrawerOpen : desktopDrawerOpen) ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>
                    
                    <BusinessIcon sx={{ mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        Sistema Archivístico
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Notificaciones */}
                        <Tooltip title="Notificaciones">
                            <IconButton
                                color="inherit"
                                onClick={() => setNotificationCenterOpen(true)}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.common.white, 0.1)
                                    }
                                }}
                            >
                                <Badge badgeContent={unreadCount} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        {/* Información del Usuario - Solo en desktop */}
                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', mr: 2 }}>
                            <Box sx={{ textAlign: 'right', mr: 2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {user?.nombre}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    {getRoleLabel(user?.rol)}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Menú de Usuario */}
                        <Tooltip title="Cuenta">
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenuOpen}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.common.white, 0.1)
                                    }
                                }}
                            >
                                <Avatar 
                                    sx={{ 
                                        width: 36, 
                                        height: 36,
                                        bgcolor: getRoleColor(user?.rol),
                                        fontSize: '1rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {user?.nombre?.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>
                        </Tooltip>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                                sx: {
                                    mt: 1,
                                    minWidth: 200,
                                    borderRadius: 0, // Sin bordes redondeados
                                    boxShadow: theme.shadows[3]
                                }
                            }}
                        >
                            <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {user?.nombre}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    @{user?.username}
                                </Typography>
                            </Box>
                            
                            <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
                                <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
                                Configuración
                            </MenuItem>
                            
                            <Divider />
                            
                            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                                <ExitToApp sx={{ mr: 2, fontSize: 20 }} />
                                Cerrar Sesión
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer para Mobile */}
            <Drawer
                variant="temporary"
                open={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: DRAWER_WIDTH,
                        borderRadius: 0, // Sin bordes redondeados
                        borderRight: 'none',
                        boxShadow: theme.shadows[4]
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Drawer para Desktop */}
            <Drawer
                variant="persistent"
                open={desktopDrawerOpen}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: DRAWER_WIDTH,
                        borderRadius: 0, // Sin bordes redondeados
                        borderRight: `1px solid ${theme.palette.divider}`,
                        boxShadow: 'none',
                        position: 'fixed',
                        height: '100vh',
                        zIndex: theme.zIndex.drawer,
                        top: 0, // Desde la parte superior
                        bottom: 0, // Hasta la parte inferior (cubriendo el footer)
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Contenido Principal */}
            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    pt: '64px', // Altura del AppBar
                    pb: '56px', // Altura del Footer (añadido)
                    ml: { 
                        xs: 0, 
                        md: desktopDrawerOpen ? `${DRAWER_WIDTH}px` : 0 
                    },
                    transition: theme.transitions.create(['margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    backgroundColor: theme.palette.background.default,
                    minHeight: `calc(100vh - 120px)`, // 64px AppBar + 56px Footer
                    position: 'relative',
                    overflow: 'auto', // Permitir scroll en el contenido
                    '&::before': {
                        content: '""',
                        position: 'fixed',
                        top: 0,
                        left: desktopDrawerOpen && !isMobile ? DRAWER_WIDTH : 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'url(/procovar.png)',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center center',
                        backgroundSize: 'contain',
                        opacity: 0.04,
                        zIndex: 0,
                        pointerEvents: 'none',
                        transform: 'rotate(-15deg)',
                        transformOrigin: 'center center',
                        transition: theme.transitions.create(['left'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                        [theme.breakpoints.down('lg')]: {
                            backgroundSize: 'contain',
                            opacity: 0.035,
                        },
                        [theme.breakpoints.down('md')]: {
                            backgroundSize: 'contain',
                            opacity: 0.03,
                            left: 0,
                        },
                        [theme.breakpoints.down('sm')]: {
                            backgroundSize: 'contain',
                            opacity: 0.025,
                            transform: 'rotate(-12deg)',
                        }
                    }
                }}
            >
                {/* Contenido de la página */}
                <Box 
                    sx={{ 
                        flex: 1,
                        p: { xs: 2, sm: 3 },
                        position: 'relative', 
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        maxWidth: '100%',
                        mx: 'auto',
                        width: '100%',
                        overflowY: 'auto', // Scroll vertical si es necesario
                        maxHeight: `calc(100vh - 120px)`, // Limitar altura para scroll
                    }}
                >
                    {children}
                </Box>

                {/* Footer Fijo */}
                <Footer 
                    drawerOpen={desktopDrawerOpen} 
                    drawerWidth={DRAWER_WIDTH} 
                />
            </Box>

            {/* Centro de Notificaciones */}
            <NotificationCenter
                open={notificationCenterOpen}
                onClose={() => {
                    setNotificationCenterOpen(false);
                    refreshNotifications(); // Refrescar contador al cerrar
                }}
            />

            {/* Alertas de Notificaciones en Tiempo Real */}
            <NotificationAlert />
        </Box>
    );
};

export default Layout;