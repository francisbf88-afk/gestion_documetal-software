import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Grid,
    Card,
    CardContent,
    IconButton,
    Chip,
    Alert,
    CircularProgress,
    Paper,
    Stack,
    useTheme,
    alpha,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
    Tooltip,
    Badge,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Folder as FolderIcon,
    FolderOpen as FolderOpenIcon,
    Description as DocIcon,
    TableChart as ExcelIcon,
    PictureAsPdf as PdfIcon,
    Image as ImageIcon,
    InsertDriveFile as FileIcon,
    MoveToInbox as MoveIcon,
    Visibility as ViewIcon,
    Download as DownloadIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';
import PageHeader from './PageHeader';
import axios from 'axios';

const CategoryManagement = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);
    const [moveDialogOpen, setMoveDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryDocuments, setCategoryDocuments] = useState([]);
    const [documentsLoading, setDocumentsLoading] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [targetCategory, setTargetCategory] = useState('');
    const [documentsPagination, setDocumentsPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
    });
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        color: '#2196F3',
        icono: '📁',
        orden: 0
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const { user } = useAuth();
    const theme = useTheme();

    useEffect(() => {
        // Verificar que sea administrador
        if (user?.rol !== 'admin') {
            navigate('/dashboard');
            return;
        }

        fetchCategorias();
    }, [user, navigate]);

    const fetchCategorias = async () => {
        try {
            setLoading(true);
            console.log('Fetching categories...');
            const response = await axios.get('/api/categories?includeInactive=true');
            console.log('Categories response:', response.data);
            setCategorias(response.data);
            setError(''); // Limpiar errores previos
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            if (error.response?.status === 401) {
                setError('No tienes permisos para ver las categorías. Inicia sesión como administrador.');
            } else if (error.response?.status === 404) {
                setError('El endpoint de categorías no fue encontrado. Verifica que el backend esté funcionando.');
            } else if (error.code === 'NETWORK_ERROR' || !error.response) {
                setError('Error de conexión. Verifica que el backend esté funcionando en el puerto correcto.');
            } else {
                setError(error.response?.data?.message || 'Error al cargar las categorías');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (categoria = null) => {
        if (categoria) {
            setEditingCategory(categoria);
            setFormData({
                nombre: categoria.nombre,
                descripcion: categoria.descripcion || '',
                color: categoria.color,
                icono: categoria.icono,
                orden: categoria.orden
            });
        } else {
            setEditingCategory(null);
            setFormData({
                nombre: '',
                descripcion: '',
                color: '#2196F3',
                icono: '📁',
                orden: categorias.length
            });
        }
        setDialogOpen(true);
        setError('');
        setSuccess('');
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingCategory(null);
        setFormData({
            nombre: '',
            descripcion: '',
            color: '#2196F3',
            icono: '📁',
            orden: 0
        });
        setError('');
    };

    const handleSubmit = async () => {
        try {
            if (!formData.nombre.trim()) {
                setError('El nombre de la categoría es requerido');
                return;
            }

            if (editingCategory) {
                // Actualizar categoría existente
                await axios.put(`/api/categories/${editingCategory.id}`, formData);
                setSuccess('Categoría actualizada exitosamente');
            } else {
                // Crear nueva categoría
                await axios.post('/api/categories', formData);
                setSuccess('Categoría creada exitosamente');
            }

            handleCloseDialog();
            fetchCategorias();
        } catch (error) {
            console.error('Error al guardar categoría:', error);
            setError(error.response?.data?.message || 'Error al guardar la categoría');
        }
    };

    const handleDelete = async (categoria) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar la categoría "${categoria.nombre}"?\n\nLos documentos en esta categoría serán movidos a "Archivo General".`)) {
            try {
                await axios.delete(`/api/categories/${categoria.id}`);
                setSuccess('Categoría eliminada exitosamente');
                fetchCategorias();
            } catch (error) {
                console.error('Error al eliminar categoría:', error);
                setError(error.response?.data?.message || 'Error al eliminar la categoría');
            }
        }
    };

    // Funciones para gestión de documentos
    const handleViewDocuments = async (categoria) => {
        setSelectedCategory(categoria);
        setDocumentsDialogOpen(true);
        await fetchCategoryDocuments(categoria.id);
    };

    const fetchCategoryDocuments = async (categoryId, page = 1) => {
        try {
            setDocumentsLoading(true);
            const response = await axios.get(`/api/categories/${categoryId}/documents?page=${page}&limit=20`);
            setCategoryDocuments(response.data.documents);
            setDocumentsPagination(response.data.pagination);
        } catch (error) {
            console.error('Error al cargar documentos de categoría:', error);
            setError('Error al cargar los documentos de la categoría');
        } finally {
            setDocumentsLoading(false);
        }
    };

    const handleMoveDocument = (document) => {
        setSelectedDocument(document);
        setTargetCategory('');
        setMoveDialogOpen(true);
    };

    const handleConfirmMove = async () => {
        if (!selectedDocument || !targetCategory) return;

        try {
            await axios.put(`/api/categories/${selectedCategory.id}/documents/${selectedDocument.id}/move`, {
                newCategoryId: targetCategory
            });

            setSuccess(`Documento "${selectedDocument.nombre_original}" movido exitosamente`);
            setMoveDialogOpen(false);
            setSelectedDocument(null);
            setTargetCategory('');
            
            // Refrescar documentos de la categoría actual
            await fetchCategoryDocuments(selectedCategory.id, documentsPagination.page);
            
            // Refrescar categorías para actualizar contadores
            fetchCategorias();
        } catch (error) {
            console.error('Error al mover documento:', error);
            setError(error.response?.data?.message || 'Error al mover el documento');
        }
    };

    const handleDownloadDocument = async (document) => {
        try {
            const response = await axios.get(`/api/documents/${document.id}/download`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', document.nombre_original);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setError('Error al descargar documento');
            console.error('Error al descargar:', error);
        }
    };

    const getFileIcon = (formato) => {
        switch (formato?.toLowerCase()) {
            case 'docx':
            case 'doc':
                return <DocIcon color="primary" />;
            case 'xlsx':
            case 'xls':
            case 'csv':
                return <ExcelIcon color="success" />;
            case 'pdf':
                return <PdfIcon color="error" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'bmp':
            case 'webp':
                return <ImageIcon color="info" />;
            case 'txt':
            case 'rtf':
                return <FileIcon color="action" />;
            default:
                return <DocIcon />;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const predefinedIcons = ['📁', '📋', '⚖️', '💰', '👥', '🔧', '📢', '📊', '🏢', '📝', '🎯', '🔒', '🌟', '⚡', '🎨', '📱'];
    const predefinedColors = ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#00BCD4', '#E91E63', '#607D8B', '#795548', '#FF5722'];

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
            <Container maxWidth="xl" sx={{ py: 3 }}>
                {/* Header */}
                <PageHeader
                    title="Gestión de Categorías"
                    subtitle="Organiza y administra las categorías del sistema archivístico"
                    icon="📁"
                    onBack={() => navigate('/dashboard')}
                    userRole={user?.rol}
                    color="info"
                    actions={[
                        <Button
                            key="add-category"
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            size="large"
                            sx={{ borderRadius: 2 }}
                        >
                            Nueva Categoría
                        </Button>
                    ]}
                />

                {/* Alerts */}
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3,
                            borderRadius: 2
                        }} 
                        onClose={() => setError('')}
                    >
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert 
                        severity="success" 
                        sx={{ 
                            mb: 3,
                            borderRadius: 2
                        }} 
                        onClose={() => setSuccess('')}
                    >
                        {success}
                    </Alert>
                )}

                {/* Categories Grid */}
                <Grid container spacing={3}>
                    {categorias.map((categoria) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={categoria.id}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    borderRadius: 3,
                                    border: `2px solid ${categoria.color}`,
                                    opacity: categoria.activa ? 1 : 0.6,
                                    transition: 'all 0.3s ease-in-out',
                                    background: `linear-gradient(135deg, ${alpha(categoria.color, 0.05)} 0%, ${alpha(categoria.color, 0.02)} 100%)`,
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 10px 25px ${alpha(categoria.color, 0.3)}`,
                                        border: `2px solid ${categoria.color}`,
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography 
                                            variant="h3" 
                                            sx={{ 
                                                mr: 2,
                                                fontSize: '2.5rem',
                                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                            }}
                                        >
                                            {categoria.icono}
                                        </Typography>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    color: categoria.color,
                                                    fontWeight: 700,
                                                    mb: 0.5
                                                }}
                                            >
                                                {categoria.nombre}
                                            </Typography>
                                            {!categoria.activa && (
                                                <Chip 
                                                    label="Inactiva" 
                                                    size="small" 
                                                    color="warning" 
                                                    variant="filled"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            )}
                                        </Box>
                                    </Box>

                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ 
                                            mb: 3,
                                            minHeight: '2.5em',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {categoria.descripcion || 'Sin descripción'}
                                    </Typography>

                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Chip 
                                            icon={<FolderIcon />}
                                            label={`${categoria.documentos_activos || 0} docs`}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{ fontWeight: 600 }}
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                            Orden: {categoria.orden}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                                        <Tooltip title="Ver documentos">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewDocuments(categoria)}
                                                color="info"
                                                sx={{
                                                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.info.main, 0.2),
                                                    }
                                                }}
                                            >
                                                <Badge badgeContent={categoria.documentos_activos || 0} color="primary">
                                                    <FolderOpenIcon />
                                                </Badge>
                                            </IconButton>
                                        </Tooltip>
                                        
                                        <Stack direction="row" spacing={1}>
                                            <Tooltip title="Editar categoría">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenDialog(categoria)}
                                                    color="primary"
                                                    sx={{
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                        '&:hover': {
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                                        }
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={categoria.nombre === 'Archivo General' ? 'No se puede eliminar la categoría por defecto' : 'Eliminar categoría'}>
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDelete(categoria)}
                                                        color="error"
                                                        disabled={categoria.nombre === 'Archivo General'}
                                                        sx={{
                                                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                                                            '&:hover': {
                                                                backgroundColor: alpha(theme.palette.error.main, 0.2),
                                                            },
                                                            '&:disabled': {
                                                                backgroundColor: alpha(theme.palette.grey[400], 0.1),
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Empty State */}
                {categorias.length === 0 && !loading && (
                    <Paper 
                        sx={{ 
                            p: 6, 
                            textAlign: 'center',
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.grey[100], 0.5)} 0%, ${alpha(theme.palette.grey[50], 0.5)} 100%)`
                        }}
                    >
                        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                            📁 No hay categorías disponibles
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Crea tu primera categoría para organizar los documentos
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            size="large"
                        >
                            Crear Primera Categoría
                        </Button>
                    </Paper>
                )}

                {/* Create/Edit Category Dialog */}
                <Dialog 
                    open={dialogOpen} 
                    onClose={handleCloseDialog}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`
                        }
                    }}
                >
                    <DialogTitle sx={{ pb: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {editingCategory ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {editingCategory ? 
                                'Modifica los detalles de la categoría existente' : 
                                'Crea una nueva categoría para organizar documentos'
                            }
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nombre de la Categoría"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                    variant="outlined"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                    🎨 Color de la Categoría
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Color"
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    sx={{ 
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': { borderRadius: 2 }
                                    }}
                                />
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {predefinedColors.map((color) => (
                                        <Box
                                            key={color}
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                backgroundColor: color,
                                                borderRadius: 2,
                                                cursor: 'pointer',
                                                border: formData.color === color ? '3px solid #000' : '2px solid #ddd',
                                                transition: 'all 0.2s ease-in-out',
                                                '&:hover': {
                                                    transform: 'scale(1.1)',
                                                    boxShadow: `0 4px 8px ${alpha(color, 0.4)}`
                                                }
                                            }}
                                            onClick={() => setFormData({ ...formData, color })}
                                        />
                                    ))}
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                    📊 Configuración
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Orden de Visualización"
                                    type="number"
                                    value={formData.orden}
                                    onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                                    sx={{ 
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': { borderRadius: 2 }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                    🎭 Icono de la Categoría
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={formData.icono}
                                    onChange={(e) => setFormData({ ...formData, icono: e.target.value })}
                                    placeholder="Ingresa un emoji"
                                    sx={{ 
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': { borderRadius: 2 }
                                    }}
                                />
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {predefinedIcons.map((icon) => (
                                        <Button
                                            key={icon}
                                            variant={formData.icono === icon ? 'contained' : 'outlined'}
                                            size="small"
                                            onClick={() => setFormData({ ...formData, icono: icon })}
                                            sx={{ 
                                                minWidth: 48,
                                                height: 48,
                                                fontSize: '1.5rem',
                                                borderRadius: 2
                                            }}
                                        >
                                            {icon}
                                        </Button>
                                    ))}
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper 
                                    sx={{ 
                                        p: 3, 
                                        borderRadius: 2,
                                        background: `linear-gradient(135deg, ${alpha(formData.color, 0.1)} 0%, ${alpha(formData.color, 0.05)} 100%)`,
                                        border: `2px solid ${alpha(formData.color, 0.2)}`
                                    }}
                                >
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                        👀 Vista Previa:
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                                        <Typography variant="h4">{formData.icono}</Typography>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                color: formData.color, 
                                                fontWeight: 700
                                            }}
                                        >
                                            {formData.nombre || 'Nombre de la categoría'}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {formData.descripcion || 'Descripción de la categoría'}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 1 }}>
                        <Button 
                            onClick={handleCloseDialog} 
                            startIcon={<CancelIcon />}
                            size="large"
                            sx={{ borderRadius: 2 }}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                            variant="contained"
                            startIcon={<SaveIcon />}
                            size="large"
                            sx={{ borderRadius: 2 }}
                        >
                            {editingCategory ? 'Actualizar' : 'Crear'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Documents Dialog */}
                <Dialog 
                    open={documentsDialogOpen} 
                    onClose={() => setDocumentsDialogOpen(false)}
                    maxWidth="lg"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            maxHeight: '90vh'
                        }
                    }}
                >
                    <DialogTitle>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center" gap={2}>
                                {selectedCategory && (
                                    <>
                                        <Typography variant="h4">{selectedCategory.icono}</Typography>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: selectedCategory.color }}>
                                                📁 Documentos en "{selectedCategory.nombre}"
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {categoryDocuments.length} documento{categoryDocuments.length !== 1 ? 's' : ''} encontrado{categoryDocuments.length !== 1 ? 's' : ''}
                                            </Typography>
                                        </Box>
                                    </>
                                )}
                            </Box>
                            <IconButton onClick={() => setDocumentsDialogOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        {documentsLoading ? (
                            <Box display="flex" justifyContent="center" p={4}>
                                <CircularProgress />
                            </Box>
                        ) : categoryDocuments.length === 0 ? (
                            <Paper 
                                sx={{ 
                                    p: 4, 
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.grey[100], 0.5)} 0%, ${alpha(theme.palette.grey[50], 0.5)} 100%)`
                                }}
                            >
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                    📄 No hay documentos en esta categoría
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Los documentos aparecerán aquí cuando sean subidos a esta categoría
                                </Typography>
                            </Paper>
                        ) : (
                            <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                                <List>
                                    {categoryDocuments.map((doc, index) => (
                                        <React.Fragment key={doc.id}>
                                            <ListItem sx={{ py: 2 }}>
                                                <ListItemIcon>
                                                    {getFileIcon(doc.formato)}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                                {doc.nombre_original}
                                                            </Typography>
                                                            <Chip
                                                                label={doc.tipo_nombre}
                                                                size="small"
                                                                variant="outlined"
                                                                color="primary"
                                                            />
                                                            <Chip
                                                                label={doc.importancia_nivel}
                                                                size="small"
                                                                color={
                                                                    doc.importancia_nivel === 'Alta' ? 'error' :
                                                                    doc.importancia_nivel === 'Media' ? 'warning' : 'success'
                                                                }
                                                            />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Subido por: {doc.usuario_nombre} • {new Date(doc.fecha_subida).toLocaleDateString()} • {formatFileSize(doc.tamaño)}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                                <ListItemSecondaryAction>
                                                    <Stack direction="row" spacing={1}>
                                                        <Tooltip title="Ver documento">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => navigate(`/documents/${doc.id}`)}
                                                            >
                                                                <ViewIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Descargar documento">
                                                            <IconButton
                                                                size="small"
                                                                color="success"
                                                                onClick={() => handleDownloadDocument(doc)}
                                                            >
                                                                <DownloadIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {(user?.rol === 'admin' || doc.id_usuario === user?.id) && (
                                                            <Tooltip title="Mover a otra categoría">
                                                                <IconButton
                                                                    size="small"
                                                                    color="warning"
                                                                    onClick={() => handleMoveDocument(doc)}
                                                                >
                                                                    <MoveIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Stack>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            {index < categoryDocuments.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Paper>
                        )}

                        {/* Pagination */}
                        {documentsPagination.pages > 1 && (
                            <Box display="flex" justifyContent="center" mt={3}>
                                <Pagination
                                    count={documentsPagination.pages}
                                    page={documentsPagination.page}
                                    onChange={(event, value) => fetchCategoryDocuments(selectedCategory.id, value)}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Move Document Dialog */}
                <Dialog 
                    open={moveDialogOpen} 
                    onClose={() => setMoveDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3
                        }
                    }}
                >
                    <DialogTitle>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            📦 Mover Documento
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Selecciona la nueva categoría para el documento
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        {selectedDocument && (
                            <Box mb={3}>
                                <Paper 
                                    sx={{ 
                                        p: 2, 
                                        borderRadius: 2,
                                        background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                                        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2}>
                                        {getFileIcon(selectedDocument.formato)}
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {selectedDocument.nombre_original}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Categoría actual: {selectedCategory?.nombre}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Box>
                        )}

                        <FormControl fullWidth>
                            <InputLabel>Nueva Categoría</InputLabel>
                            <Select
                                value={targetCategory}
                                label="Nueva Categoría"
                                onChange={(e) => setTargetCategory(e.target.value)}
                            >
                                {categorias
                                    .filter(cat => cat.id !== selectedCategory?.id && cat.activa)
                                    .map((categoria) => (
                                        <MenuItem key={categoria.id} value={categoria.id}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                                    {categoria.icono}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: categoria.color, fontWeight: 600 }}>
                                                    {categoria.nombre}
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 1 }}>
                        <Button 
                            onClick={() => setMoveDialogOpen(false)}
                            size="large"
                            sx={{ borderRadius: 2 }}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleConfirmMove}
                            variant="contained"
                            disabled={!targetCategory}
                            size="large"
                            sx={{ borderRadius: 2 }}
                        >
                            Mover Documento
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Layout>
    );
};

export default CategoryManagement;