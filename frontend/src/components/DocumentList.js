import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    IconButton,
    Pagination,
    CircularProgress,
    Alert,
    ToggleButton,
    ToggleButtonGroup,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Paper
} from '@mui/material';
import {
    Visibility as ViewIcon,
    Download as DownloadIcon,
    Delete as DeleteIcon,
    Description as DocIcon,
    TableChart as ExcelIcon,
    PictureAsPdf as PdfIcon,
    Image as ImageIcon,
    ViewList as ListViewIcon,
    ViewModule as GridViewIcon,
    ViewQuilt as PreviewViewIcon,
    InsertDriveFile as FileIcon,
    OpenInNew as OpenExternalIcon,
    Help as HelpIcon,
    Security as SecurityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';
import ExternalEditorHelp from './ExternalEditorHelp';
import DocumentPermissions from './DocumentPermissions';
import axios from 'axios';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [importancias, setImportancias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'list', 'grid', 'preview'
    const [showHelp, setShowHelp] = useState(false);
    const [showPermissions, setShowPermissions] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [filters, setFilters] = useState({
        tipo: '',
        importancia: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
    });

    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const fetchMetadata = async () => {
        try {
            const [tiposRes, importanciasRes] = await Promise.all([
                axios.get('/api/metadata/tipos-documento'),
                axios.get('/api/metadata/importancias')
            ]);
            setTipos(tiposRes.data);
            setImportancias(importanciasRes.data);
        } catch (error) {
            console.error('Error al obtener metadatos:', error);
        }
    };

    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...(filters.tipo && { tipo: filters.tipo }),
                ...(filters.importancia && { importancia: filters.importancia })
            });

            const response = await axios.get(`/api/documents?${params}`);
            setDocuments(response.data.documents);
            setPagination(prev => ({
                ...prev,
                total: response.data.pagination.total,
                pages: response.data.pagination.pages
            }));
            setError('');
        } catch (error) {
            setError('Error al cargar documentos');
            console.error('Error al obtener documentos:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, filters.tipo, filters.importancia]);

    useEffect(() => {
        fetchMetadata();
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (event, value) => {
        setPagination(prev => ({ ...prev, page: value }));
    };

    const handleDownload = async (documentId, filename) => {
        try {
            const response = await axios.get(`/api/documents/${documentId}/download`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setError('Error al descargar documento');
            console.error('Error al descargar:', error);
        }
    };

    const handleDelete = async (documentId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
            try {
                await axios.delete(`/api/documents/${documentId}`);
                fetchDocuments();
            } catch (error) {
                setError('Error al eliminar documento');
                console.error('Error al eliminar:', error);
            }
        }
    };

    const handleOpenExternal = async (documentId, filename) => {
        try {
            await axios.post(`/api/documents/${documentId}/open-external`);
            // Mostrar mensaje de éxito temporal
            const successMsg = `${filename} abierto en editor externo`;
            setError(''); // Limpiar errores previos
            // Usar un estado temporal para mostrar el mensaje
            const alertDiv = document.createElement('div');
            alertDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4caf50;
                color: white;
                padding: 12px 20px;
                border-radius: 4px;
                z-index: 9999;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            `;
            alertDiv.textContent = successMsg;
            document.body.appendChild(alertDiv);
            setTimeout(() => {
                if (document.body.contains(alertDiv)) {
                    document.body.removeChild(alertDiv);
                }
            }, 3000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al abrir documento en editor externo';
            setError(errorMessage);
            console.error('Error al abrir en editor externo:', error);
        }
    };

    const handleOpenPermissions = (doc) => {
        setSelectedDocument(doc);
        setShowPermissions(true);
    };

    const handleClosePermissions = () => {
        setShowPermissions(false);
        setSelectedDocument(null);
    };

    const handlePermissionsUpdated = () => {
        // Refrescar la lista de documentos si es necesario
        fetchDocuments();
    };

    const getFileIcon = (formato) => {
        switch (formato.toLowerCase()) {
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

    const isExternalEditorSupported = (formato) => {
        const supportedFormats = ['doc', 'docx', 'pdf', 'xlsx', 'xls', 'csv', 'txt', 'rtf'];
        return supportedFormats.includes(formato?.toLowerCase());
    };

    const getFileIconLarge = (formato) => {
        const iconProps = { sx: { fontSize: 48 } };
        switch (formato.toLowerCase()) {
            case 'docx':
            case 'doc':
                return <DocIcon color="primary" {...iconProps} />;
            case 'xlsx':
            case 'xls':
            case 'csv':
                return <ExcelIcon color="success" {...iconProps} />;
            case 'pdf':
                return <PdfIcon color="error" {...iconProps} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'bmp':
            case 'webp':
                return <ImageIcon color="info" {...iconProps} />;
            case 'txt':
            case 'rtf':
                return <FileIcon color="action" {...iconProps} />;
            default:
                return <DocIcon {...iconProps} />;
        }
    };

    const getPreviewUrl = (doc) => {
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(doc.formato.toLowerCase())) {
            return `/api/documents/${doc.id}/file`;
        }
        return null;
    };

    const getImportanceColor = (nivel) => {
        switch (nivel) {
            case 'Alta':
                return 'error';
            case 'Media':
                return 'warning';
            case 'Baja':
                return 'success';
            default:
                return 'default';
        }
    };

    // Componente para vista de lista
    const ListView = () => (
        <Paper>
            <List>
                {documents.map((doc, index) => (
                    <React.Fragment key={doc.id}>
                        <ListItem>
                            <ListItemIcon>
                                {getFileIcon(doc.formato)}
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="subtitle1">
                                            {doc.nombre_original}
                                        </Typography>
                                        <Chip
                                            label={doc.tipo_nombre}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={doc.importancia_nivel}
                                            size="small"
                                            color={getImportanceColor(doc.importancia_nivel)}
                                        />
                                    </Box>
                                }
                                secondary={
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">
                                            Subido por: {doc.usuario_nombre} • {new Date(doc.fecha_subida).toLocaleDateString()} • {(doc.tamaño / 1024).toFixed(1)} KB
                                        </Typography>
                                    </Box>
                                }
                            />
                            <ListItemSecondaryAction>
                                <Box display="flex" gap={1}>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => navigate(`/documents/${doc.id}`)}
                                        title="Ver documento"
                                    >
                                        <ViewIcon />
                                    </IconButton>
                                    
                                    {/* Opción de editar oculta - mantenida para uso futuro */}
                                    {/* {(isAdmin || user?.rol === 'editor') && 
                                     ['docx', 'txt', 'xlsx', 'xls', 'csv', 'html'].includes(doc.formato) && (
                                        <IconButton
                                            size="small"
                                            color="secondary"
                                            onClick={() => navigate(`/documents/${doc.id}/edit`)}
                                            title="Editar documento"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    )} */}

                                    {isExternalEditorSupported(doc.formato) && (
                                        <IconButton
                                            size="small"
                                            color="info"
                                            onClick={() => handleOpenExternal(doc.id, doc.nombre_original)}
                                            title="Abrir en editor externo"
                                        >
                                            <OpenExternalIcon />
                                        </IconButton>
                                    )}
                                    
                                    {isAdmin && (
                                        <>
                                            <IconButton
                                                size="small"
                                                color="info"
                                                onClick={() => handleOpenPermissions(doc)}
                                                title="Configurar permisos"
                                            >
                                                <SecurityIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="success"
                                                onClick={() => handleDownload(doc.id, doc.nombre_original)}
                                                title="Descargar documento"
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(doc.id)}
                                                title="Eliminar documento"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </Box>
                            </ListItemSecondaryAction>
                        </ListItem>
                        {index < documents.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );

    // Componente para vista de cuadrícula
    const GridView = () => (
        <Grid container spacing={3}>
            {documents.map((doc) => (
                <Grid item xs={12} sm={6} md={4} key={doc.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                {getFileIcon(doc.formato)}
                                <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }} noWrap>
                                    {doc.nombre_original}
                                </Typography>
                            </Box>
                            
                            <Box mb={2}>
                                <Chip
                                    label={doc.tipo_nombre}
                                    size="small"
                                    sx={{ mr: 1, mb: 1 }}
                                />
                                <Chip
                                    label={doc.importancia_nivel}
                                    size="small"
                                    color={getImportanceColor(doc.importancia_nivel)}
                                />
                            </Box>

                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Subido por: {doc.usuario_nombre}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Fecha: {new Date(doc.fecha_subida).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Tamaño: {(doc.tamaño / 1024).toFixed(1)} KB
                            </Typography>
                        </CardContent>

                        <Box display="flex" justifyContent="space-between" p={2} pt={0}>
                            <IconButton
                                color="primary"
                                onClick={() => navigate(`/documents/${doc.id}`)}
                                title="Ver documento"
                            >
                                <ViewIcon />
                            </IconButton>
                            
                            {/* Opción de editar oculta - mantenida para uso futuro */}
                            {/* {(isAdmin || user?.rol === 'editor') && 
                             ['docx', 'txt', 'xlsx', 'xls', 'csv', 'html'].includes(doc.formato) && (
                                <IconButton
                                    color="secondary"
                                    onClick={() => navigate(`/documents/${doc.id}/edit`)}
                                    title="Editar documento"
                                >
                                    <EditIcon />
                                </IconButton>
                            )} */}

                            {isExternalEditorSupported(doc.formato) && (
                                <IconButton
                                    color="info"
                                    onClick={() => handleOpenExternal(doc.id, doc.nombre_original)}
                                    title="Abrir en editor externo"
                                >
                                    <OpenExternalIcon />
                                </IconButton>
                            )}
                            
                            {isAdmin && (
                                <>
                                    <IconButton
                                        color="info"
                                        onClick={() => handleOpenPermissions(doc)}
                                        title="Configurar permisos"
                                    >
                                        <SecurityIcon />
                                    </IconButton>
                                    <IconButton
                                        color="success"
                                        onClick={() => handleDownload(doc.id, doc.nombre_original)}
                                        title="Descargar documento"
                                    >
                                        <DownloadIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(doc.id)}
                                        title="Eliminar documento"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    // Componente para vista previa
    const PreviewView = () => (
        <Grid container spacing={3}>
            {documents.map((doc) => {
                const previewUrl = getPreviewUrl(doc);
                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {previewUrl ? (
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={previewUrl}
                                    alt={doc.nombre_original}
                                    sx={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        height: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'grey.100'
                                    }}
                                >
                                    {getFileIconLarge(doc.formato)}
                                </Box>
                            )}
                            
                            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                <Typography variant="subtitle2" noWrap title={doc.nombre_original}>
                                    {doc.nombre_original}
                                </Typography>
                                
                                <Box mt={1} mb={1}>
                                    <Chip
                                        label={doc.tipo_nombre}
                                        size="small"
                                        sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                                    />
                                    <Chip
                                        label={doc.importancia_nivel}
                                        size="small"
                                        color={getImportanceColor(doc.importancia_nivel)}
                                        sx={{ fontSize: '0.7rem' }}
                                    />
                                </Box>

                                <Typography variant="caption" color="textSecondary" display="block">
                                    {doc.usuario_nombre}
                                </Typography>
                                <Typography variant="caption" color="textSecondary" display="block">
                                    {new Date(doc.fecha_subida).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {(doc.tamaño / 1024).toFixed(1)} KB
                                </Typography>
                            </CardContent>

                            <Box display="flex" justifyContent="center" p={1} gap={0.5}>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => navigate(`/documents/${doc.id}`)}
                                    title="Ver documento"
                                >
                                    <ViewIcon fontSize="small" />
                                </IconButton>
                                
                                {/* Opción de editar oculta - mantenida para uso futuro */}
                                {/* {(isAdmin || user?.rol === 'editor') && 
                                 ['docx', 'txt', 'xlsx', 'xls', 'csv', 'html'].includes(doc.formato) && (
                                    <IconButton
                                        size="small"
                                        color="secondary"
                                        onClick={() => navigate(`/documents/${doc.id}/edit`)}
                                        title="Editar documento"
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                )} */}

                                {isExternalEditorSupported(doc.formato) && (
                                    <IconButton
                                        size="small"
                                        color="info"
                                        onClick={() => handleOpenExternal(doc.id, doc.nombre_original)}
                                        title="Abrir en editor externo"
                                    >
                                        <OpenExternalIcon fontSize="small" />
                                    </IconButton>
                                )}
                                
                                {isAdmin && (
                                    <>
                                        <IconButton
                                            size="small"
                                            color="info"
                                            onClick={() => handleOpenPermissions(doc)}
                                            title="Configurar permisos"
                                        >
                                            <SecurityIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="success"
                                            onClick={() => handleDownload(doc.id, doc.nombre_original)}
                                            title="Descargar documento"
                                        >
                                            <DownloadIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(doc.id)}
                                            title="Eliminar documento"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                        </Card>
                    </Grid>
                )
            })}
        </Grid>
    );

    // Función para renderizar la vista actual
    const renderCurrentView = () => {
        switch (viewMode) {
            case 'list':
                return <ListView />;
            case 'grid':
                return <GridView />;
            case 'preview':
                return <PreviewView />;
            default:
                return <GridView />;
        }
    };

    return (
        <Layout>
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4">
                        Documentos
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        {/* Controles de vista */}
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(e, newView) => newView && setViewMode(newView)}
                            size="small"
                        >
                            <ToggleButton value="list" aria-label="vista de lista">
                                <ListViewIcon />
                            </ToggleButton>
                            <ToggleButton value="grid" aria-label="vista de cuadrícula">
                                <GridViewIcon />
                            </ToggleButton>
                            <ToggleButton value="preview" aria-label="vista previa">
                                <PreviewViewIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                        
                        {isAdmin && (
                            <Button
                                variant="contained"
                                onClick={() => navigate('/upload')}
                                sx={{ mr: 1 }}
                            >
                                Subir Documento
                            </Button>
                        )}
                        
                        <Button
                            variant="outlined"
                            startIcon={<HelpIcon />}
                            onClick={() => setShowHelp(true)}
                            size="small"
                        >
                            Ayuda Editor Externo
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Filtros */}
                <Box mb={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Tipo de Documento</InputLabel>
                                <Select
                                    value={filters.tipo}
                                    label="Tipo de Documento"
                                    onChange={(e) => handleFilterChange('tipo', e.target.value)}
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    {tipos.map((tipo) => (
                                        <MenuItem key={tipo.id} value={tipo.id}>
                                            {tipo.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Importancia</InputLabel>
                                <Select
                                    value={filters.importancia}
                                    label="Importancia"
                                    onChange={(e) => handleFilterChange('importancia', e.target.value)}
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {importancias.map((importancia) => (
                                        <MenuItem key={importancia.id} value={importancia.id}>
                                            {importancia.nivel}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Buscar por nombre"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Lista de documentos */}
                {loading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {renderCurrentView()}

                        {/* Paginación */}
                        {pagination.pages > 1 && (
                            <Box display="flex" justifyContent="center" mt={4}>
                                <Pagination
                                    count={pagination.pages}
                                    page={pagination.page}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        )}

                        {documents.length === 0 && !loading && (
                            <Box textAlign="center" py={4}>
                                <Typography variant="h6" color="textSecondary">
                                    No se encontraron documentos
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
                
                <ExternalEditorHelp 
                    open={showHelp} 
                    onClose={() => setShowHelp(false)} 
                />

                <DocumentPermissions
                    open={showPermissions}
                    onClose={handleClosePermissions}
                    documentId={selectedDocument?.id}
                    documentTitle={selectedDocument?.nombre_original}
                    onPermissionsUpdated={handlePermissionsUpdated}
                />
            </Container>
        </Layout>
    );
};

export default DocumentList;