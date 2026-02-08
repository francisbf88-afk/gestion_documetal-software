import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip,
    Switch,
    FormControlLabel,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import {
    Add as AddIcon,
    ArrowBack as BackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Lock as LockIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [myPasswordDialogOpen, setMyPasswordDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        username: '',
        email: '',
        password: '',
        rol: ''
    });
    const [editFormData, setEditFormData] = useState({
        nombre: '',
        username: '',
        email: '',
        rol: '',
        activo: true
    });
    const [newPassword, setNewPassword] = useState('');
    const [myPasswordData, setMyPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();
    const { user } = useAuth();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (roleFilter) params.append('rol', roleFilter);
            
            const response = await axios.get(`/api/users?${params.toString()}`);
            setUsers(response.data.users);
        } catch (error) {
            setError('Error al cargar usuarios');
            console.error('Error al obtener usuarios:', error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, roleFilter]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await axios.get('/api/users/stats/overview');
            setStats(response.data);
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
        }
    }, []);

    useEffect(() => {
        if (user?.rol !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchUsers();
        fetchStats();
    }, [user, navigate, fetchUsers, fetchStats]);

    const handleDialogOpen = () => {
        setDialogOpen(true);
        setError('');
        setSuccess('');
        setFormData({
            nombre: '',
            username: '',
            email: '',
            password: '',
            rol: ''
        });
    };

    const handleEditDialogOpen = (user) => {
        setSelectedUser(user);
        setEditFormData({
            nombre: user.nombre,
            username: user.username,
            email: user.email || '',
            rol: user.rol,
            activo: user.activo
        });
        setEditDialogOpen(true);
        setError('');
        setSuccess('');
    };

    const handlePasswordDialogOpen = (user) => {
        setSelectedUser(user);
        setNewPassword('');
        setPasswordDialogOpen(true);
        setError('');
        setSuccess('');
    };

    const handleMyPasswordDialogOpen = () => {
        setMyPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setMyPasswordDialogOpen(true);
        setError('');
        setSuccess('');
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditDialogOpen(false);
        setPasswordDialogOpen(false);
        setMyPasswordDialogOpen(false);
        setSelectedUser(null);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditInputChange = (field, value) => {
        setEditFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.nombre || !formData.username || !formData.password || !formData.rol) {
            setError('Todos los campos son requeridos');
            return;
        }

        try {
            await axios.post('/api/users', formData);
            setSuccess('Usuario creado exitosamente');
            handleDialogClose();
            fetchUsers();
            fetchStats();
        } catch (error) {
            setError(error.response?.data?.message || 'Error al crear usuario');
        }
    };

    const handleUpdate = async () => {
        if (!editFormData.nombre || !editFormData.username || !editFormData.rol) {
            setError('Nombre, username y rol son requeridos');
            return;
        }

        try {
            await axios.put(`/api/users/${selectedUser.id}`, editFormData);
            setSuccess('Usuario actualizado exitosamente');
            handleDialogClose();
            fetchUsers();
            fetchStats();
        } catch (error) {
            setError(error.response?.data?.message || 'Error al actualizar usuario');
        }
    };

    const handlePasswordChange = async () => {
        if (!newPassword || newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            await axios.put(`/api/users/${selectedUser.id}/password`, { password: newPassword });
            setSuccess('Contraseña actualizada exitosamente');
            handleDialogClose();
        } catch (error) {
            setError(error.response?.data?.message || 'Error al cambiar contraseña');
        }
    };

    const handleMyPasswordChange = async () => {
        if (!myPasswordData.currentPassword || !myPasswordData.newPassword || !myPasswordData.confirmPassword) {
            setError('Todos los campos son requeridos');
            return;
        }

        if (myPasswordData.newPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (myPasswordData.newPassword !== myPasswordData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            await axios.put('/api/users/me/password', {
                currentPassword: myPasswordData.currentPassword,
                newPassword: myPasswordData.newPassword
            });
            setSuccess('Tu contraseña ha sido actualizada exitosamente');
            handleDialogClose();
        } catch (error) {
            setError(error.response?.data?.message || 'Error al cambiar contraseña');
        }
    };

    const handleDeactivate = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres desactivar este usuario?')) {
            try {
                await axios.delete(`/api/users/${userId}`);
                setSuccess('Usuario desactivado exitosamente');
                fetchUsers();
                fetchStats();
            } catch (error) {
                setError(error.response?.data?.message || 'Error al desactivar usuario');
            }
        }
    };

    const getRoleColor = (rol) => {
        switch (rol) {
            case 'admin':
                return 'error';
            case 'editor':
                return 'warning';
            case 'asesor':
                return 'info';
            default:
                return 'default';
        }
    };

    const getRoleLabel = (rol) => {
        switch (rol) {
            case 'admin':
                return 'Administrador';
            case 'editor':
                return 'Editor';
            case 'asesor':
                return 'Asesor';
            default:
                return rol;
        }
    };

    if (loading) {
        return (
            <Layout>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center">
                        <Button
                            startIcon={<BackIcon />}
                            onClick={() => navigate('/dashboard')}
                            sx={{ mr: 2 }}
                        >
                            Volver
                        </Button>
                        <Typography variant="h4">
                            Gestión de Usuarios
                        </Typography>
                    </Box>
                    <Box display="flex" gap={2}>
                        <Button
                            variant="outlined"
                            startIcon={<LockIcon />}
                            onClick={handleMyPasswordDialogOpen}
                            color="warning"
                        >
                            Cambiar Mi Contraseña
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleDialogOpen}
                        >
                            Nuevo Usuario
                        </Button>
                    </Box>
                </Box>

                {/* Estadísticas */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total Usuarios
                                </Typography>
                                <Typography variant="h4">
                                    {stats.total_usuarios || 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Usuarios Activos
                                </Typography>
                                <Typography variant="h4" color="success.main">
                                    {stats.usuarios_activos || 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Administradores
                                </Typography>
                                <Typography variant="h4" color="error.main">
                                    {stats.administradores || 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Editores
                                </Typography>
                                <Typography variant="h4" color="warning.main">
                                    {stats.editores || 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Filtros */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Buscar por nombre, username o email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Filtrar por Rol</InputLabel>
                                <Select
                                    value={roleFilter}
                                    label="Filtrar por Rol"
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    <MenuItem value="admin">Administrador</MenuItem>
                                    <MenuItem value="editor">Editor</MenuItem>
                                    <MenuItem value="asesor">Asesor</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => {
                                    setSearchTerm('');
                                    setRoleFilter('');
                                }}
                            >
                                Limpiar Filtros
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Rol</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Fecha Creación</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <Typography color="textSecondary">
                                                No hay usuarios para mostrar
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((userItem) => (
                                        <TableRow key={userItem.id}>
                                            <TableCell>{userItem.id}</TableCell>
                                            <TableCell>{userItem.nombre}</TableCell>
                                            <TableCell>{userItem.username}</TableCell>
                                            <TableCell>{userItem.email || '-'}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getRoleLabel(userItem.rol)}
                                                    color={getRoleColor(userItem.rol)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={userItem.activo ? 'Activo' : 'Inactivo'}
                                                    color={userItem.activo ? 'success' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {new Date(userItem.fecha_creacion).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Editar información del usuario">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleEditDialogOpen(userItem)}
                                                            color="primary"
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title={`Cambiar contraseña de ${userItem.nombre}`}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handlePasswordDialogOpen(userItem)}
                                                            color="warning"
                                                        >
                                                            <LockIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {userItem.id !== user.id && (
                                                        <Tooltip title={`Desactivar usuario ${userItem.nombre}`}>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDeactivate(userItem.id)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {userItem.id === user.id && (
                                                        <Tooltip title="No puedes desactivar tu propia cuenta">
                                                            <span>
                                                                <IconButton
                                                                    size="small"
                                                                    disabled
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Dialog para crear usuario */}
                <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 1 }}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                value={formData.nombre}
                                onChange={(e) => handleInputChange('nombre', e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Nombre de Usuario"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Email (opcional)"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Contraseña"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Rol</InputLabel>
                                <Select
                                    value={formData.rol}
                                    label="Rol"
                                    onChange={(e) => handleInputChange('rol', e.target.value)}
                                >
                                    <MenuItem value="admin">Administrador</MenuItem>
                                    <MenuItem value="editor">Editor</MenuItem>
                                    <MenuItem value="asesor">Asesor</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancelar</Button>
                        <Button onClick={handleSubmit} variant="contained">
                            Crear Usuario
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog para editar usuario */}
                <Dialog open={editDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>Editar Usuario</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 1 }}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                value={editFormData.nombre}
                                onChange={(e) => handleEditInputChange('nombre', e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Nombre de Usuario"
                                value={editFormData.username}
                                onChange={(e) => handleEditInputChange('username', e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={editFormData.email}
                                onChange={(e) => handleEditInputChange('email', e.target.value)}
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Rol</InputLabel>
                                <Select
                                    value={editFormData.rol}
                                    label="Rol"
                                    onChange={(e) => handleEditInputChange('rol', e.target.value)}
                                >
                                    <MenuItem value="admin">Administrador</MenuItem>
                                    <MenuItem value="editor">Editor</MenuItem>
                                    <MenuItem value="asesor">Asesor</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={editFormData.activo}
                                        onChange={(e) => handleEditInputChange('activo', e.target.checked)}
                                    />
                                }
                                label="Usuario Activo"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancelar</Button>
                        <Button onClick={handleUpdate} variant="contained">
                            Actualizar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog para cambiar contraseña */}
                <Dialog open={passwordDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        <Box display="flex" alignItems="center" gap={1}>
                            <LockIcon color="warning" />
                            <Typography variant="h6">
                                Cambiar Contraseña de Usuario
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 1 }}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    <strong>Usuario:</strong> {selectedUser?.nombre} ({selectedUser?.username})
                                </Typography>
                                <Typography variant="body2">
                                    Como administrador, puedes cambiar la contraseña de cualquier usuario sin conocer la contraseña actual.
                                </Typography>
                            </Alert>
                            <TextField
                                fullWidth
                                label="Nueva Contraseña"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                margin="normal"
                                helperText="Mínimo 6 caracteres"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancelar</Button>
                        <Button onClick={handlePasswordChange} variant="contained" color="warning">
                            Cambiar Contraseña
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog para cambiar mi propia contraseña */}
                <Dialog open={myPasswordDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        <Box display="flex" alignItems="center" gap={1}>
                            <LockIcon color="primary" />
                            <Typography variant="h6">
                                Cambiar Mi Contraseña
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 1 }}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    <strong>Usuario:</strong> {user?.nombre} ({user?.username})
                                </Typography>
                                <Typography variant="body2">
                                    Por seguridad, necesitas ingresar tu contraseña actual para cambiarla.
                                </Typography>
                            </Alert>
                            <TextField
                                fullWidth
                                label="Contraseña Actual"
                                type="password"
                                value={myPasswordData.currentPassword}
                                onChange={(e) => setMyPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Nueva Contraseña"
                                type="password"
                                value={myPasswordData.newPassword}
                                onChange={(e) => setMyPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                margin="normal"
                                helperText="Mínimo 6 caracteres"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Confirmar Nueva Contraseña"
                                type="password"
                                value={myPasswordData.confirmPassword}
                                onChange={(e) => setMyPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                margin="normal"
                                required
                                error={myPasswordData.newPassword !== myPasswordData.confirmPassword && myPasswordData.confirmPassword !== ''}
                                helperText={
                                    myPasswordData.newPassword !== myPasswordData.confirmPassword && myPasswordData.confirmPassword !== '' 
                                        ? 'Las contraseñas no coinciden' 
                                        : ''
                                }
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancelar</Button>
                        <Button onClick={handleMyPasswordChange} variant="contained" color="primary">
                            Cambiar Mi Contraseña
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Información sobre roles y seguridad */}
                <Box mt={4}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    🔐 Gestión de Contraseñas
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Alert severity="info">
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Cambio de Contraseña Propia:
                                        </Typography>
                                        <Typography variant="body2">
                                            • Requiere contraseña actual por seguridad<br/>
                                            • Mínimo 6 caracteres<br/>
                                            • Se aplica inmediatamente
                                        </Typography>
                                    </Alert>
                                    <Alert severity="warning">
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Cambio de Contraseña de Otros Usuarios:
                                        </Typography>
                                        <Typography variant="body2">
                                            • Solo disponible para administradores<br/>
                                            • No requiere contraseña actual<br/>
                                            • El usuario debe cambiarla en su próximo acceso
                                        </Typography>
                                    </Alert>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    👥 Información sobre Roles y Permisos
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip label="Administrador" color="error" size="small" />
                                        <Typography variant="body2">
                                            Acceso completo: gestión de usuarios, documentos, configuración del sistema.
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip label="Editor" color="warning" size="small" />
                                        <Typography variant="body2">
                                            Puede crear, leer, editar y descargar documentos.
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip label="Asesor" color="info" size="small" />
                                        <Typography variant="body2">
                                            Solo puede leer y descargar documentos.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Layout>
    );
};

export default UserManagement;