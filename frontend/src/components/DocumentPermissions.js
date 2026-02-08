import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    Switch,
    FormControlLabel,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    TextField,
    Autocomplete,
    Alert,
    Divider,
    useTheme,
    alpha
} from '@mui/material';
import {
    Person as PersonIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Security as SecurityIcon,
    Public as PublicIcon,
    Lock as PrivateIcon
} from '@mui/icons-material';
import axios from 'axios';

const DocumentPermissions = ({ open, onClose, documentId, documentTitle, onPermissionsUpdated }) => {
    const [users, setUsers] = useState([]);
    const [documentPermissions, setDocumentPermissions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isPublic, setIsPublic] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const theme = useTheme();

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users/for-permissions');
            setUsers(response.data); // Ya no necesitamos filtrar porque el backend lo hace
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            setError('Error al cargar la lista de usuarios');
        }
    };

    const fetchDocumentPermissions = useCallback(async () => {
        try {
            const response = await axios.get(`/api/documents/${documentId}/permissions`);
            setDocumentPermissions(response.data.permissions || []);
            setIsPublic(response.data.isPublic || false);
        } catch (error) {
            console.error('Error al obtener permisos:', error);
            setError('Error al cargar los permisos del documento');
        }
    }, [documentId]);

    useEffect(() => {
        if (open && documentId) {
            fetchUsers();
            fetchDocumentPermissions();
        }
    }, [open, documentId, fetchDocumentPermissions]);

    const handleAddPermission = async () => {
        if (!selectedUser) return;

        try {
            setLoading(true);
            await axios.post(`/api/documents/${documentId}/permissions`, {
                id_usuario: selectedUser.id,
                puede_leer: true,
                puede_editar: false,
                puede_eliminar: false,
                puede_descargar: true
            });

            setSuccess('Permiso agregado exitosamente');
            setSelectedUser(null);
            fetchDocumentPermissions();
        } catch (error) {
            setError('Error al agregar permiso');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePermission = async (userId, permissionType, value) => {
        try {
            const permission = documentPermissions.find(p => p.id_usuario === userId);
            const updatedPermission = { ...permission, [permissionType]: value };

            await axios.put(`/api/documents/${documentId}/permissions/${userId}`, updatedPermission);
            
            setDocumentPermissions(prev => 
                prev.map(p => p.id_usuario === userId ? { ...p, [permissionType]: value } : p)
            );
            setSuccess('Permiso actualizado exitosamente');
        } catch (error) {
            setError('Error al actualizar permiso');
        }
    };

    const handleRemovePermission = async (userId) => {
        try {
            await axios.delete(`/api/documents/${documentId}/permissions/${userId}`);
            setDocumentPermissions(prev => prev.filter(p => p.id_usuario !== userId));
            setSuccess('Permiso eliminado exitosamente');
        } catch (error) {
            setError('Error al eliminar permiso');
        }
    };

    const handleTogglePublic = async () => {
        try {
            setLoading(true);
            await axios.put(`/api/documents/${documentId}/visibility`, {
                es_publico: !isPublic
            });
            setIsPublic(!isPublic);
            setSuccess(`Documento ${!isPublic ? 'público' : 'privado'} exitosamente`);
            if (onPermissionsUpdated) onPermissionsUpdated();
        } catch (error) {
            setError('Error al cambiar la visibilidad del documento');
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (rol) => {
        switch (rol) {
            case 'admin': return 'error';
            case 'editor': return 'warning';
            case 'asesor': return 'info';
            default: return 'default';
        }
    };

    const getRoleIcon = (rol) => {
        switch (rol) {
            case 'admin': return <SecurityIcon />;
            case 'editor': return <EditIcon />;
            case 'asesor': return <ViewIcon />;
            default: return <PersonIcon />;
        }
    };

    const availableUsers = users.filter(user => 
        !documentPermissions.some(perm => perm.id_usuario === user.id)
    );

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={2}>
                    <SecurityIcon color="primary" />
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            🔐 Configuración de Permisos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {documentTitle}
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                )}

                {/* Configuración de Visibilidad Global */}
                <Card sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            {isPublic ? <PublicIcon color="success" /> : <PrivateIcon color="warning" />}
                            Visibilidad del Documento
                        </Typography>
                        
                        <Box 
                            sx={{ 
                                p: 2, 
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${alpha(theme.palette[isPublic ? 'success' : 'warning'].main, 0.1)} 0%, ${alpha(theme.palette[isPublic ? 'success' : 'warning'].main, 0.05)} 100%)`,
                                border: `1px solid ${alpha(theme.palette[isPublic ? 'success' : 'warning'].main, 0.2)}`
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isPublic}
                                        onChange={handleTogglePublic}
                                        disabled={loading}
                                        color={isPublic ? 'success' : 'warning'}
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {isPublic ? '🌐 Documento Público' : '🔒 Documento Privado'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {isPublic ? 
                                                'Visible para todos los usuarios del sistema' : 
                                                'Solo visible para usuarios con permisos específicos'
                                            }
                                        </Typography>
                                    </Box>
                                }
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* Agregar Nuevo Usuario */}
                <Card sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AddIcon color="primary" />
                            Agregar Usuario
                        </Typography>
                        
                        <Box display="flex" gap={2} alignItems="center">
                            <Autocomplete
                                options={availableUsers}
                                getOptionLabel={(option) => `${option.nombre} (${option.email})`}
                                value={selectedUser}
                                onChange={(event, newValue) => setSelectedUser(newValue)}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette[getRoleColor(option.rol)].main }}>
                                            {getRoleIcon(option.rol)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {option.nombre}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {option.email} • {option.rol}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Seleccionar Usuario"
                                        placeholder="Buscar por nombre o email..."
                                        variant="outlined"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                )}
                                sx={{ flexGrow: 1 }}
                                disabled={loading}
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddPermission}
                                disabled={!selectedUser || loading}
                                sx={{ borderRadius: 2 }}
                            >
                                Agregar
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Lista de Permisos */}
                <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon color="secondary" />
                            Usuarios con Permisos ({documentPermissions.length})
                        </Typography>

                        {documentPermissions.length === 0 ? (
                            <Box 
                                sx={{ 
                                    textAlign: 'center', 
                                    py: 4,
                                    color: 'text.secondary'
                                }}
                            >
                                <PersonIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                                <Typography variant="body1">
                                    No hay usuarios con permisos específicos
                                </Typography>
                                <Typography variant="body2">
                                    {isPublic ? 'El documento es público para todos' : 'Agrega usuarios para otorgar acceso'}
                                </Typography>
                            </Box>
                        ) : (
                            <List>
                                {documentPermissions.map((permission, index) => (
                                    <React.Fragment key={permission.id_usuario}>
                                        <ListItem sx={{ px: 0, py: 2 }}>
                                            <ListItemAvatar>
                                                <Avatar 
                                                    sx={{ 
                                                        bgcolor: theme.palette[getRoleColor(permission.usuario_rol)].main,
                                                        width: 48,
                                                        height: 48
                                                    }}
                                                >
                                                    {getRoleIcon(permission.usuario_rol)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {permission.usuario_nombre}
                                                        </Typography>
                                                        <Chip
                                                            label={permission.usuario_rol}
                                                            size="small"
                                                            color={getRoleColor(permission.usuario_rol)}
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box sx={{ mt: 1 }}>
                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                            {permission.usuario_email}
                                                        </Typography>
                                                        <Box display="flex" gap={2} mt={1} flexWrap="wrap">
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        checked={permission.puede_leer}
                                                                        onChange={(e) => handleUpdatePermission(permission.id_usuario, 'puede_leer', e.target.checked)}
                                                                        size="small"
                                                                        color="info"
                                                                    />
                                                                }
                                                                label={
                                                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                                        👁️ Ver
                                                                    </Typography>
                                                                }
                                                                sx={{ mr: 1, mb: 0.5 }}
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        checked={permission.puede_editar}
                                                                        onChange={(e) => handleUpdatePermission(permission.id_usuario, 'puede_editar', e.target.checked)}
                                                                        size="small"
                                                                        color="warning"
                                                                    />
                                                                }
                                                                label={
                                                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                                        ✏️ Editar
                                                                    </Typography>
                                                                }
                                                                sx={{ mr: 1, mb: 0.5 }}
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        checked={permission.puede_descargar}
                                                                        onChange={(e) => handleUpdatePermission(permission.id_usuario, 'puede_descargar', e.target.checked)}
                                                                        size="small"
                                                                        color="success"
                                                                    />
                                                                }
                                                                label={
                                                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                                        💾 Descargar
                                                                    </Typography>
                                                                }
                                                                sx={{ mb: 0.5 }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                }
                                            />
                                            
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    color="error"
                                                    onClick={() => handleRemovePermission(permission.id_usuario)}
                                                    sx={{
                                                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                                                        '&:hover': {
                                                            backgroundColor: alpha(theme.palette.error.main, 0.2),
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {index < documentPermissions.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </CardContent>
                </Card>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button 
                    onClick={onClose}
                    size="large"
                    sx={{ borderRadius: 2 }}
                >
                    Cerrar
                </Button>
                <Button 
                    variant="contained"
                    onClick={onClose}
                    size="large"
                    sx={{ borderRadius: 2 }}
                >
                    Guardar Cambios
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DocumentPermissions;