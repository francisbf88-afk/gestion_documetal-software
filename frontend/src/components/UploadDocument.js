import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    LinearProgress,
    FormControlLabel,
    Switch,
    Chip,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Divider,
    Stack,
    useTheme,
    alpha
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Delete as DeleteIcon,
    CheckCircle as SuccessIcon,
    Error as ErrorIcon,
    PriorityHigh as HighPriorityIcon,
    Remove as MediumPriorityIcon,
    KeyboardArrowDown as LowPriorityIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';
import PageHeader from './PageHeader';
import ContentSection from './ContentSection';
import axios from 'axios';

const UploadDocument = () => {
    const [files, setFiles] = useState([]);
    const [multipleMode, setMultipleMode] = useState(false);
    const [tipoDocumento, setTipoDocumento] = useState('');
    const [importancia, setImportancia] = useState('');
    const [categoria, setCategoria] = useState('');
    const [esPublico, setEsPublico] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadResults, setUploadResults] = useState(null);
    
    // Metadatos
    const [tiposDocumento, setTiposDocumento] = useState([]);
    const [importancias, setImportancias] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const navigate = useNavigate();
    const { user } = useAuth();
    const theme = useTheme();

    useEffect(() => {
        // Verificar permisos de creación
        if (!['admin', 'editor'].includes(user?.rol)) {
            navigate('/dashboard');
            return;
        }

        // Cargar metadatos
        const fetchMetadata = async () => {
            try {
                console.log('Fetching metadata...');
                const [tiposRes, importanciasRes, categoriasRes] = await Promise.all([
                    axios.get('/api/metadata/tipos-documento'),
                    axios.get('/api/metadata/importancias'),
                    axios.get('/api/categories')
                ]);
                
                console.log('Tipos:', tiposRes.data);
                console.log('Importancias:', importanciasRes.data);
                console.log('Categorías:', categoriasRes.data);
                
                setTiposDocumento(tiposRes.data);
                setImportancias(importanciasRes.data);
                setCategorias(categoriasRes.data);
                
                // Establecer valores por defecto
                if (importanciasRes.data.length > 0) {
                    // Buscar "Media" como valor por defecto, o usar el primero
                    const mediaImportancia = importanciasRes.data.find(imp => imp.nivel === 'Media');
                    setImportancia(mediaImportancia ? mediaImportancia.id.toString() : importanciasRes.data[0].id.toString());
                }
                
                if (tiposRes.data.length > 0) {
                    // Buscar "Otro" como valor por defecto, o usar el primero
                    const otroTipo = tiposRes.data.find(tipo => tipo.nombre === 'Otro');
                    setTipoDocumento(otroTipo ? otroTipo.id.toString() : tiposRes.data[0].id.toString());
                }

                if (categoriasRes.data.length > 0) {
                    // Buscar "Archivo General" como valor por defecto, o usar el primero
                    const archivoGeneral = categoriasRes.data.find(cat => cat.nombre === 'Archivo General');
                    setCategoria(archivoGeneral ? archivoGeneral.id.toString() : categoriasRes.data[0].id.toString());
                }
                
            } catch (error) {
                console.error('Error al cargar metadatos:', error);
                console.error('Error response:', error.response?.data);
                
                if (error.response?.status === 401) {
                    setError('No tienes permisos para acceder a esta funcionalidad. Inicia sesión como administrador o editor.');
                } else if (error.code === 'NETWORK_ERROR' || !error.response) {
                    setError('Error de conexión. Verifica que el backend esté funcionando.');
                } else {
                    setError('Error al cargar los tipos de documento, importancias y categorías: ' + (error.response?.data?.message || error.message));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMetadata();
    }, [user, navigate]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        
        if (selectedFiles.length === 0) return;

        const validFiles = [];
        const invalidFiles = [];

        selectedFiles.forEach(file => {
            // Validar tamaño (50MB máximo)
            if (file.size > 50 * 1024 * 1024) {
                invalidFiles.push({
                    name: file.name,
                    reason: 'Archivo demasiado grande (máximo 50MB)'
                });
                return;
            }

            // Validar extensión según tipo de documento seleccionado
            if (tipoDocumento && !validateFileForType(file, tipoDocumento)) {
                const tipo = tiposDocumento.find(t => t.id.toString() === tipoDocumento.toString());
                invalidFiles.push({
                    name: file.name,
                    reason: `Formato no permitido para "${tipo?.nombre}". Formatos permitidos: ${tipo?.extensiones_permitidas?.join(', ')}`
                });
                return;
            }

            validFiles.push(file);
        });

        if (multipleMode) {
            setFiles(prevFiles => [...prevFiles, ...validFiles]);
        } else {
            setFiles(validFiles.slice(0, 1)); // Solo el primer archivo válido en modo simple
        }

        if (invalidFiles.length > 0) {
            const errorMsg = invalidFiles.map(f => `${f.name}: ${f.reason}`).join('\n');
            setError(`Archivos no válidos:\n${errorMsg}`);
        } else {
            setError('');
        }
    };

    const removeFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setError('');
    };

    const clearAllFiles = () => {
        setFiles([]);
        document.getElementById('file-input').value = '';
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (files.length === 0) {
            setError('Debe seleccionar al menos un archivo');
            return;
        }

        if (!tipoDocumento) {
            setError('Debe seleccionar un tipo de documento');
            return;
        }

        if (!importancia) {
            setError('Debe seleccionar una importancia');
            return;
        }

        if (!categoria) {
            setError('Debe seleccionar una categoría');
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setError('');
        setSuccess('');
        setUploadResults(null);

        const formData = new FormData();
        
        if (multipleMode) {
            // Subida múltiple - validar archivos antes de enviar
            const validFiles = [];
            const invalidFiles = [];

            files.forEach(file => {
                // Validar tamaño
                if (file.size > 50 * 1024 * 1024) {
                    invalidFiles.push({
                        name: file.name,
                        reason: 'Archivo demasiado grande (máximo 50MB)'
                    });
                    return;
                }

                // Validar formato
                if (!validateFileForType(file, tipoDocumento)) {
                    const tipo = tiposDocumento.find(t => t.id.toString() === tipoDocumento.toString());
                    invalidFiles.push({
                        name: file.name,
                        reason: `Formato no permitido para "${tipo?.nombre}"`
                    });
                    return;
                }

                validFiles.push(file);
            });

            // Si hay archivos inválidos, mostrar advertencia pero continuar con los válidos
            if (invalidFiles.length > 0) {
                const warningMsg = `Archivos omitidos:\n${invalidFiles.map(f => `${f.name}: ${f.reason}`).join('\n')}`;
                console.warn(warningMsg);
            }

            if (validFiles.length === 0) {
                setError('No hay archivos válidos para subir');
                setUploading(false);
                return;
            }

            // Agregar solo archivos válidos
            validFiles.forEach(file => {
                formData.append('documents', file);
            });
            formData.append('tipo_documento', tipoDocumento);
            formData.append('importancia', importancia);
            formData.append('categoria', categoria);
            formData.append('es_publico', esPublico);

            try {
                const response = await axios.post('/api/documents/upload-multiple', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                });

                setUploadResults(response.data);
                
                // Mostrar mensaje de éxito con detalles
                if (response.data.summary.successful > 0) {
                    let successMsg = `${response.data.summary.successful} documento(s) subido(s) exitosamente`;
                    if (response.data.summary.failed > 0) {
                        successMsg += `. ${response.data.summary.failed} archivo(s) tuvieron errores.`;
                    }
                    if (invalidFiles.length > 0) {
                        successMsg += ` ${invalidFiles.length} archivo(s) fueron omitidos por validación.`;
                    }
                    setSuccess(successMsg);
                } else {
                    setError('No se pudo subir ningún archivo. Revisa los errores detallados.');
                }
                
                // Limpiar formulario solo si hubo éxitos
                if (response.data.summary.successful > 0) {
                    setFiles([]);
                    document.getElementById('file-input').value = '';
                }

            } catch (error) {
                console.error('Error al subir documentos:', error);
                
                // Manejar diferentes tipos de errores
                if (error.response?.status === 400) {
                    setError(error.response.data.message || 'Error de validación en los archivos');
                } else if (error.response?.status === 413) {
                    setError('Archivos demasiado grandes. Reduce el tamaño o cantidad de archivos.');
                } else if (error.code === 'NETWORK_ERROR') {
                    setError('Error de conexión. Verifica tu conexión a internet.');
                } else {
                    setError(error.response?.data?.message || 'Error al subir documentos. Inténtalo de nuevo.');
                }
            }
        } else {
            // Subida individual
            const file = files[0];
            
            // Validar archivo individual
            if (file.size > 50 * 1024 * 1024) {
                setError('El archivo es demasiado grande (máximo 50MB)');
                setUploading(false);
                return;
            }

            if (!validateFileForType(file, tipoDocumento)) {
                const tipo = tiposDocumento.find(t => t.id.toString() === tipoDocumento.toString());
                setError(`Formato no permitido para "${tipo?.nombre}". Formatos permitidos: ${tipo?.extensiones_permitidas?.join(', ')}`);
                setUploading(false);
                return;
            }

            formData.append('document', file);
            formData.append('tipo_documento', tipoDocumento);
            formData.append('importancia', importancia);
            formData.append('categoria', categoria);
            formData.append('es_publico', esPublico);

            try {
                await axios.post('/api/documents/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                });

                setSuccess('Documento subido exitosamente');
                
                // Limpiar formulario
                setFiles([]);
                document.getElementById('file-input').value = '';

                // Redirigir después de 2 segundos
                setTimeout(() => {
                    navigate('/documents');
                }, 2000);

            } catch (error) {
                console.error('Error al subir documento:', error);
                
                // Manejar diferentes tipos de errores
                if (error.response?.status === 400) {
                    setError(error.response.data.message || 'Error de validación del archivo');
                } else if (error.response?.status === 413) {
                    setError('Archivo demasiado grande. Máximo 50MB permitido.');
                } else if (error.code === 'NETWORK_ERROR') {
                    setError('Error de conexión. Verifica tu conexión a internet.');
                } else {
                    setError(error.response?.data?.message || 'Error al subir documento. Inténtalo de nuevo.');
                }
            }
        }

        setUploading(false);
        setUploadProgress(0);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileTypeIcon = (filename) => {
        const ext = filename.toLowerCase().substring(filename.lastIndexOf('.') + 1);
        const icons = {
            // Documentos
            pdf: '📄',
            docx: '📝', doc: '📝',
            txt: '📄', rtf: '📄', odt: '📝',
            
            // Hojas de cálculo
            xlsx: '📊', xls: '📊',
            csv: '📊', ods: '📊',
            
            // Presentaciones
            pptx: '📽️', ppt: '📽️', odp: '📽️',
            
            // Imágenes
            jpg: '🖼️', jpeg: '🖼️', png: '🖼️',
            gif: '🖼️', bmp: '🖼️', webp: '🖼️', svg: '🎨',
            
            // Bases de datos
            accdb: '🗃️', mdb: '🗃️',
            db: '🗃️', sqlite: '🗃️',
            
            // Archivos comprimidos
            zip: '📦', rar: '📦', '7z': '📦',
            tar: '📦', gz: '📦',
            
            // Audio
            mp3: '🎵', wav: '🎵', ogg: '🎵', flac: '🎵',
            
            // Video
            mp4: '🎬', avi: '🎬', mkv: '🎬',
            mov: '🎬', wmv: '🎬',
            
            // Código
            json: '⚙️', xml: '⚙️', html: '🌐',
            css: '🎨', js: '⚡', py: '🐍',
            java: '☕', cpp: '⚙️', c: '⚙️'
        };
        return icons[ext] || '📄';
    };

    const getPriorityIcon = (nivel) => {
        switch (nivel) {
            case 'Alta':
                return <HighPriorityIcon color="error" />;
            case 'Media':
                return <MediumPriorityIcon color="warning" />;
            case 'Baja':
                return <LowPriorityIcon color="success" />;
            default:
                return <InfoIcon />;
        }
    };

    const getPriorityColor = (nivel) => {
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

    const validateFileForType = (file, tipoId) => {
        if (!tipoId) return true; // Si no hay tipo seleccionado, permitir cualquier archivo
        
        const tipo = tiposDocumento.find(t => t.id.toString() === tipoId.toString());
        if (!tipo || !tipo.extensiones_permitidas) return true;
        
        // Si es tipo "Todos", permitir cualquier archivo
        if (tipo.nombre === 'Todos') return true;
        
        const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.') + 1);
        return tipo.extensiones_permitidas.includes(ext);
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
            <Container maxWidth="lg" sx={{ py: 3 }}>
                {/* Header */}
                <PageHeader
                    title={`Subir Documento${multipleMode ? 's' : ''}`}
                    subtitle={multipleMode ? 
                        'Sube múltiples archivos al sistema archivístico' : 
                        'Agrega un nuevo documento al sistema archivístico'
                    }
                    icon="📤"
                    onBack={() => navigate('/documents')}
                    userRole={user?.rol}
                    color="primary"
                />

                {/* Alerts */}
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3,
                            borderRadius: 2,
                            '& .MuiAlert-message': {
                                whiteSpace: 'pre-wrap'
                            }
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

                {/* Upload Results */}
                {uploadResults && (
                    <ContentSection
                        title="Resultados de la Subida"
                        icon="📊"
                        variant="outlined"
                        color="info"
                    >
                        <Box sx={{ p: 4 }}>
                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={4}>
                                    <Box 
                                        sx={{ 
                                            textAlign: 'center',
                                            p: 3,
                                            borderRadius: 2,
                                            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                                            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                                        }}
                                    >
                                        <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
                                            {uploadResults.summary.successful}
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>Exitosos</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box 
                                        sx={{ 
                                            textAlign: 'center',
                                            p: 3,
                                            borderRadius: 2,
                                            background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                                            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
                                        }}
                                    >
                                        <Typography variant="h3" color="error.main" sx={{ fontWeight: 700 }}>
                                            {uploadResults.summary.failed}
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>Fallidos</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box 
                                        sx={{ 
                                            textAlign: 'center',
                                            p: 3,
                                            borderRadius: 2,
                                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                                        }}
                                    >
                                        <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700 }}>
                                            {uploadResults.summary.total}
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>Total</Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            {uploadResults.results.length > 0 && (
                                <Box mb={3}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'success.main' }}>
                                        ✅ Archivos Subidos Exitosamente:
                                    </Typography>
                                    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                                        <List>
                                            {uploadResults.results.map((result, index) => (
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <SuccessIcon color="success" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={result.filename} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Paper>
                                </Box>
                            )}

                            {uploadResults.errors.length > 0 && (
                                <Box mb={3}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'error.main' }}>
                                        ❌ Errores:
                                    </Typography>
                                    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                                        <List>
                                            {uploadResults.errors.map((error, index) => (
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <ErrorIcon color="error" />
                                                    </ListItemIcon>
                                                    <ListItemText 
                                                        primary={error.filename}
                                                        secondary={error.error}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Paper>
                                </Box>
                            )}

                            <Button
                                variant="contained"
                                onClick={() => navigate('/documents')}
                                fullWidth
                                size="large"
                                sx={{ borderRadius: 2 }}
                            >
                                Ver Documentos
                            </Button>
                        </Box>
                    </ContentSection>
                )}

                {/* Main Form */}
                <Paper sx={{ borderRadius: 3 }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
                        {/* Document Metadata */}
                        <ContentSection
                            title="Información del Documento"
                            subtitle="Selecciona el tipo, prioridad y categoría del documento"
                            icon="📋"
                            variant="filled"
                            color="primary"
                            divider
                        >
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Tipo de Documento</InputLabel>
                                        <Select
                                            value={tipoDocumento}
                                            label="Tipo de Documento"
                                            onChange={(e) => {
                                                setTipoDocumento(e.target.value);
                                                // Revalidar archivos existentes si cambia el tipo
                                                if (files.length > 0) {
                                                    const invalidFiles = files.filter(file => 
                                                        !validateFileForType(file, e.target.value)
                                                    );
                                                    if (invalidFiles.length > 0) {
                                                        const tipo = tiposDocumento.find(t => t.id.toString() === e.target.value);
                                                        if (tipo?.nombre !== 'Todos') {
                                                            setError(`Algunos archivos no son compatibles con "${tipo?.nombre}". Formatos permitidos: ${tipo?.extensiones_permitidas?.join(', ')}`);
                                                        }
                                                    } else {
                                                        setError('');
                                                    }
                                                }
                                            }}
                                            disabled={uploading}
                                        >
                                            {tiposDocumento.map((tipo) => (
                                                <MenuItem 
                                                    key={tipo.id} 
                                                    value={tipo.id.toString()}
                                                    sx={tipo.nombre === 'Todos' ? {
                                                        background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                                                        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                                        borderRadius: 1,
                                                        mb: 0.5,
                                                        '&:hover': {
                                                            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)} 0%, ${alpha(theme.palette.success.main, 0.08)} 100%)`,
                                                        }
                                                    } : {}}
                                                >
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                        <Typography variant="body1" sx={{ 
                                                            fontWeight: tipo.nombre === 'Todos' ? 700 : 600,
                                                            color: tipo.nombre === 'Todos' ? 'success.main' : 'inherit'
                                                        }}>
                                                            {tipo.nombre === 'Todos' ? '🌟 ' : ''}{tipo.nombre}
                                                        </Typography>
                                                        {tipo.descripcion && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                {tipo.descripcion}
                                                            </Typography>
                                                        )}
                                                        {tipo.extensiones_permitidas && tipo.nombre !== 'Todos' && (
                                                            <Typography variant="caption" color="primary">
                                                                Formatos: {tipo.extensiones_permitidas.join(', ')}
                                                            </Typography>
                                                        )}
                                                        {tipo.nombre === 'Todos' && (
                                                            <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                                                                ✅ Todos los formatos permitidos
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Prioridad</InputLabel>
                                        <Select
                                            value={importancia}
                                            label="Prioridad"
                                            onChange={(e) => setImportancia(e.target.value)}
                                            disabled={uploading}
                                        >
                                            {importancias.map((imp) => (
                                                <MenuItem key={imp.id} value={imp.id.toString()}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {getPriorityIcon(imp.nivel)}
                                                        <Box>
                                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                                {imp.nivel}
                                                            </Typography>
                                                            {imp.descripcion && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {imp.descripcion}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Categoría</InputLabel>
                                        <Select
                                            value={categoria}
                                            label="Categoría"
                                            onChange={(e) => setCategoria(e.target.value)}
                                            disabled={uploading}
                                        >
                                            {categorias.map((cat) => (
                                                <MenuItem key={cat.id} value={cat.id.toString()}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                                            {cat.icono}
                                                        </Typography>
                                                        <Box>
                                                            <Typography variant="body1" sx={{ color: cat.color, fontWeight: 600 }}>
                                                                {cat.nombre}
                                                            </Typography>
                                                            {cat.descripcion && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {cat.descripcion}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* Selected Type Info */}
                            {tipoDocumento && (
                                <Box mt={3}>
                                    {(() => {
                                        const tipo = tiposDocumento.find(t => t.id.toString() === tipoDocumento.toString());
                                        return tipo && (
                                            <Alert 
                                                severity={tipo.nombre === 'Todos' ? 'success' : 'info'} 
                                                sx={{ 
                                                    borderRadius: 2,
                                                    background: tipo.nombre === 'Todos' ? 
                                                        `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)` :
                                                        `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`
                                                }}
                                            >
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {tipo.nombre === 'Todos' ? '🌟' : '📄'} Tipo seleccionado: {tipo.nombre}
                                                    </Typography>
                                                    {tipo.nombre === 'Todos' ? (
                                                        <Box>
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                ✅ Permite subir archivos de cualquier formato sin restricciones
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                📁 Ideal para subida múltiple de documentos mixtos
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                🎯 Formatos soportados: PDF, Word, Excel, PowerPoint, imágenes, audio, video, archivos comprimidos y más
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        tipo.extensiones_permitidas && (
                                                            <Typography variant="body2">
                                                                Formatos permitidos: {tipo.extensiones_permitidas.map(ext => `.${ext}`).join(', ')}
                                                            </Typography>
                                                        )
                                                    )}
                                                </Box>
                                            </Alert>
                                        );
                                    })()}
                                </Box>
                            )}

                            {/* Selected Priority Info */}
                            {importancia && (
                                <Box mt={2}>
                                    {(() => {
                                        const imp = importancias.find(i => i.id.toString() === importancia.toString());
                                        return imp && (
                                            <Chip
                                                icon={getPriorityIcon(imp.nivel)}
                                                label={`Prioridad: ${imp.nivel}`}
                                                color={getPriorityColor(imp.nivel)}
                                                variant="outlined"
                                                size="medium"
                                                sx={{ fontWeight: 600 }}
                                            />
                                        );
                                    })()}
                                </Box>
                            )}
                        </ContentSection>

                        {/* Upload Options & Access Configuration */}
                        <ContentSection
                            title="Opciones de Subida y Acceso"
                            icon="⚙️"
                            variant="filled"
                            color="secondary"
                            divider
                        >
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={multipleMode}
                                                onChange={(e) => {
                                                    setMultipleMode(e.target.checked);
                                                    setFiles([]);
                                                    document.getElementById('file-input').value = '';
                                                    setError('');
                                                }}
                                                disabled={uploading}
                                                color="secondary"
                                                size="small"
                                            />
                                        }
                                        label={
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    📁 Subida múltiple
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {multipleMode ? 'Múltiples archivos (máx. 10)' : 'Un archivo a la vez'}
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{ 
                                            m: 0,
                                            p: 2,
                                            borderRadius: 2,
                                            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                                            background: multipleMode ? 
                                                `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)` :
                                                'transparent',
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            '&:hover': {
                                                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`
                                            }
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={esPublico}
                                                onChange={(e) => setEsPublico(e.target.checked)}
                                                disabled={uploading}
                                                color="warning"
                                                size="small"
                                            />
                                        }
                                        label={
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {esPublico ? '🌐 Documento público' : '🔒 Documento privado'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {esPublico ? 'Visible para todos los usuarios' : 'Solo para usuarios autorizados'}
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{ 
                                            m: 0,
                                            p: 2,
                                            borderRadius: 2,
                                            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                                            background: esPublico ? 
                                                `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)` :
                                                'transparent',
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            '&:hover': {
                                                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.08)} 0%, ${alpha(theme.palette.warning.main, 0.03)} 100%)`
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </ContentSection>

                        {/* File Selection */}
                        <ContentSection
                            title="Selección de Archivos"
                            icon="📁"
                            divider
                        >
                            <input
                                id="file-input"
                                type="file"
                                multiple={multipleMode}
                                accept={(() => {
                                    const tipo = tiposDocumento.find(t => t.id.toString() === tipoDocumento.toString());
                                    if (tipo?.nombre === 'Todos') {
                                        return '*/*'; // Permitir cualquier tipo de archivo
                                    }
                                    return ".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.jpg,.jpeg,.png,.gif,.txt,.accdb,.mdb,.zip,.rar";
                                })()}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                disabled={uploading}
                            />
                            <label htmlFor="file-input">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<UploadIcon />}
                                    fullWidth
                                    size="large"
                                    sx={{ 
                                        p: 3, 
                                        mb: 2,
                                        borderRadius: 2,
                                        borderStyle: 'dashed',
                                        borderWidth: 2,
                                        '&:hover': {
                                            borderStyle: 'dashed',
                                            borderWidth: 2,
                                        }
                                    }}
                                    disabled={uploading}
                                >
                                    {multipleMode ? 'Seleccionar Archivos' : 'Seleccionar Archivo'}
                                </Button>
                            </label>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                {(() => {
                                    const tipo = tiposDocumento.find(t => t.id.toString() === tipoDocumento.toString());
                                    if (tipo?.nombre === 'Todos') {
                                        return `Tamaño máximo por archivo: 50MB | Cualquier formato permitido${multipleMode ? ' | Máximo 10 archivos' : ''}`;
                                    }
                                    return `Tamaño máximo por archivo: 50MB${multipleMode ? ' | Máximo 10 archivos' : ''}`;
                                })()}
                            </Typography>
                        </ContentSection>

                        {/* Selected Files */}
                        {files.length > 0 && (
                            <ContentSection
                                title={`Archivos Seleccionados (${files.length})`}
                                icon="📎"
                                variant="outlined"
                                color="info"
                                divider
                            >
                                <Box display="flex" justifyContent="flex-end" mb={2}>
                                    <Button
                                        size="small"
                                        onClick={clearAllFiles}
                                        disabled={uploading}
                                        color="error"
                                        variant="outlined"
                                    >
                                        Limpiar Todo
                                    </Button>
                                </Box>
                                <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto', borderRadius: 2 }}>
                                    <List>
                                        {files.map((file, index) => (
                                            <React.Fragment key={index}>
                                                <ListItem sx={{ py: 2 }}>
                                                    <ListItemIcon>
                                                        <Typography variant="h6">
                                                            {getFileTypeIcon(file.name)}
                                                        </Typography>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                                {file.name}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Typography variant="body2" color="text.secondary">
                                                                {formatFileSize(file.size)}
                                                            </Typography>
                                                        }
                                                    />
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => removeFile(index)}
                                                        disabled={uploading}
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItem>
                                                {index < files.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </Paper>
                            </ContentSection>
                        )}

                        {/* Progress Bar */}
                        {uploading && (
                            <ContentSection
                                title={`Subiendo archivo${multipleMode ? 's' : ''}... ${uploadProgress}%`}
                                icon="�"
                                variant="filled"
                                color="info"
                            >
                                <LinearProgress 
                                    variant="determinate" 
                                    value={uploadProgress} 
                                    sx={{ 
                                        height: 8, 
                                        borderRadius: 4,
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                        }
                                    }} 
                                />
                            </ContentSection>
                        )}

                        {/* Action Buttons */}
                        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={files.length === 0 || !tipoDocumento || !importancia || !categoria || uploading}
                                fullWidth
                                size="large"
                                sx={{ 
                                    borderRadius: 2,
                                    py: 1.5,
                                    fontWeight: 600,
                                    fontSize: '1.1rem'
                                }}
                            >
                                {uploading ? 'Subiendo...' : 
                                 multipleMode ? `Subir ${files.length} Documento${files.length !== 1 ? 's' : ''}` : 
                                 'Subir Documento'}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/documents')}
                                disabled={uploading}
                                size="large"
                                sx={{ borderRadius: 2, py: 1.5, minWidth: 120 }}
                            >
                                Cancelar
                            </Button>
                        </Stack>

                        {/* Status Indicators */}
                        {!uploading && (
                            <ContentSection
                                title="Estado de la Subida"
                                icon="📊"
                                variant="outlined"
                                color="info"
                            >
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                                    {files.length > 0 ? 
                                        <Chip 
                                            label={`✓ ${files.length} archivo${files.length !== 1 ? 's' : ''} seleccionado${files.length !== 1 ? 's' : ''}`} 
                                            color="success" 
                                            variant="filled"
                                            sx={{ fontWeight: 600 }}
                                        /> :
                                        <Chip 
                                            label="⚠ Selecciona al menos un archivo" 
                                            color="warning" 
                                            variant="outlined"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    }
                                    
                                    {tipoDocumento ? 
                                        <Chip 
                                            label={`✓ Tipo: ${tiposDocumento.find(t => t.id.toString() === tipoDocumento)?.nombre}`} 
                                            color="success" 
                                            variant="filled"
                                            sx={{ fontWeight: 600 }}
                                        /> :
                                        <Chip 
                                            label="⚠ Selecciona tipo de documento" 
                                            color="warning" 
                                            variant="outlined"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    }
                                    
                                    {importancia ? 
                                        <Chip 
                                            icon={getPriorityIcon(importancias.find(i => i.id.toString() === importancia)?.nivel)}
                                            label={`✓ Prioridad: ${importancias.find(i => i.id.toString() === importancia)?.nivel}`} 
                                            color="success" 
                                            variant="filled"
                                            sx={{ fontWeight: 600 }}
                                        /> :
                                        <Chip 
                                            label="⚠ Selecciona prioridad" 
                                            color="warning" 
                                            variant="outlined"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    }

                                    {categoria ? 
                                        <Chip 
                                            label={`✓ Categoría: ${categorias.find(c => c.id.toString() === categoria)?.nombre}`} 
                                            color="success" 
                                            variant="filled"
                                            sx={{
                                                fontWeight: 600,
                                                '& .MuiChip-label': {
                                                    color: 'white'
                                                }
                                            }}
                                        /> :
                                        <Chip 
                                            label="⚠ Selecciona categoría" 
                                            color="warning" 
                                            variant="outlined"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    }
                                </Stack>
                                
                                {files.length === 0 || !tipoDocumento || !importancia || !categoria ? (
                                    <Alert 
                                        severity="info" 
                                        sx={{ 
                                            borderRadius: 2,
                                            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                            Para habilitar el botón de subida:
                                        </Typography>
                                        <Box component="ul" sx={{ m: 0, pl: 3 }}>
                                            {files.length === 0 && <li>Selecciona al menos un archivo</li>}
                                            {!tipoDocumento && <li>Selecciona un tipo de documento</li>}
                                            {!importancia && <li>Selecciona una prioridad</li>}
                                            {!categoria && <li>Selecciona una categoría</li>}
                                        </Box>
                                    </Alert>
                                ) : (
                                    <Alert 
                                        severity="success" 
                                        sx={{ 
                                            borderRadius: 2,
                                            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                            ✅ Todo listo para subir!
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {files.length} archivo{files.length !== 1 ? 's' : ''} • 
                                            Tipo: {tiposDocumento.find(t => t.id.toString() === tipoDocumento)?.nombre} • 
                                            Prioridad: {importancias.find(i => i.id.toString() === importancia)?.nivel} • 
                                            Categoría: {categorias.find(c => c.id.toString() === categoria)?.nombre} • 
                                            {esPublico ? 'Público' : 'Privado'}
                                        </Typography>
                                    </Alert>
                                )}
                            </ContentSection>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Layout>
    );
};

export default UploadDocument;