import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    CircularProgress,
    Alert,
    Toolbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Save as SaveIcon,
    Download as DownloadIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    OpenInNew as OpenExternalIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';
import axios from 'axios';

// Componente para visualizar PDFs
const PDFViewer = ({ src, document }) => (
    <Box sx={{ height: '600px', width: '100%' }}>
        <iframe
            src={src}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title={`PDF: ${document.nombre}`}
        />
    </Box>
);

// Componente para visualizar imágenes
const ImageViewer = ({ src, document }) => (
    <Box sx={{ textAlign: 'center', p: 2 }}>
        <img
            src={src}
            alt={document.nombre}
            style={{
                maxWidth: '100%',
                maxHeight: '600px',
                objectFit: 'contain'
            }}
        />
    </Box>
);

// Componente para editar texto plano
const TextEditor = ({ content, onChange, readOnly }) => (
    <TextField
        multiline
        fullWidth
        minRows={20}
        maxRows={30}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        disabled={readOnly}
        variant="outlined"
        sx={{ 
            '& .MuiInputBase-root': {
                fontFamily: 'monospace',
                fontSize: '14px'
            }
        }}
    />
);

// Componente para editar HTML (reemplazo de ReactQuill)
const HTMLEditor = ({ content, onChange, readOnly }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [htmlContent, setHtmlContent] = useState(content);

    useEffect(() => {
        setHtmlContent(content);
    }, [content]);

    const handleSave = () => {
        onChange(htmlContent);
        setIsEditing(false);
    };

    if (readOnly) {
        return (
            <Box sx={{ p: 2, minHeight: '400px', border: '1px solid #ddd', borderRadius: 1 }}>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <Button
                    variant={!isEditing ? "contained" : "outlined"}
                    startIcon={<ViewIcon />}
                    onClick={() => setIsEditing(false)}
                    size="small"
                >
                    Vista Previa
                </Button>
                <Button
                    variant={isEditing ? "contained" : "outlined"}
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    size="small"
                >
                    Editar HTML
                </Button>
            </Box>

            {isEditing ? (
                <Box>
                    <TextField
                        multiline
                        fullWidth
                        minRows={15}
                        maxRows={25}
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        variant="outlined"
                        sx={{ 
                            mb: 2,
                            '& .MuiInputBase-root': {
                                fontFamily: 'monospace',
                                fontSize: '12px'
                            }
                        }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="contained" onClick={handleSave}>
                            Aplicar Cambios
                        </Button>
                        <Button 
                            variant="outlined" 
                            onClick={() => {
                                setHtmlContent(content);
                                setIsEditing(false);
                            }}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ p: 2, minHeight: '400px', border: '1px solid #ddd', borderRadius: 1 }}>
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </Box>
            )}
        </Box>
    );
};

// Componente para editar hojas de cálculo
const SpreadsheetEditor = ({ content, onChange, readOnly }) => {
    const [data, setData] = useState(content || []);
    const [editingCell, setEditingCell] = useState(null);
    const [cellValue, setCellValue] = useState('');

    useEffect(() => {
        setData(content || []);
    }, [content]);

    const handleCellClick = (rowIndex, colIndex) => {
        if (readOnly) return;
        
        setEditingCell({ row: rowIndex, col: colIndex });
        setCellValue(data[rowIndex]?.[colIndex] || '');
    };

    const handleCellSave = () => {
        if (!editingCell) return;

        const newData = [...data];
        if (!newData[editingCell.row]) {
            newData[editingCell.row] = [];
        }
        newData[editingCell.row][editingCell.col] = cellValue;
        
        setData(newData);
        onChange(newData);
        setEditingCell(null);
        setCellValue('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCellSave();
        } else if (e.key === 'Escape') {
            setEditingCell(null);
            setCellValue('');
        }
    };

    const maxCols = Math.max(...(data.map(row => row?.length || 0)), 5);
    const maxRows = Math.max(data.length, 10);

    return (
        <Box sx={{ height: '600px', width: '100%', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                        {Array.from({ length: maxCols }, (_, colIndex) => (
                            <th 
                                key={colIndex}
                                style={{ 
                                    border: '1px solid #ddd', 
                                    padding: '12px',
                                    fontWeight: 'bold',
                                    minWidth: '120px',
                                    textAlign: 'left'
                                }}
                            >
                                {String.fromCharCode(65 + colIndex)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: maxRows }, (_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: maxCols }, (_, colIndex) => (
                                <td 
                                    key={colIndex}
                                    style={{ 
                                        border: '1px solid #ddd', 
                                        padding: '0',
                                        minWidth: '120px',
                                        position: 'relative'
                                    }}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                >
                                    {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                                        <input
                                            type="text"
                                            value={cellValue}
                                            onChange={(e) => setCellValue(e.target.value)}
                                            onBlur={handleCellSave}
                                            onKeyDown={handleKeyPress}
                                            autoFocus
                                            style={{
                                                width: '100%',
                                                border: 'none',
                                                padding: '12px',
                                                outline: '2px solid #1976d2',
                                                backgroundColor: '#fff'
                                            }}
                                        />
                                    ) : (
                                        <div 
                                            style={{ 
                                                padding: '12px',
                                                cursor: readOnly ? 'default' : 'pointer',
                                                minHeight: '20px'
                                            }}
                                        >
                                            {data[rowIndex]?.[colIndex] || ''}
                                        </div>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <Dialog open={!!editingCell} onClose={() => setEditingCell(null)}>
                <DialogTitle>Editar Celda</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        fullWidth
                        variant="outlined"
                        value={cellValue}
                        onChange={(e) => setCellValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingCell(null)}>Cancelar</Button>
                    <Button onClick={handleCellSave} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const DocumentViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [document, setDocument] = useState(null);
    const [content, setContent] = useState('');
    const [originalContent, setOriginalContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [canEdit, setCanEdit] = useState(false);
    const [contentType, setContentType] = useState('');

    const fetchDocument = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/documents/${id}/content`);
            const { type, content: docContent, canEdit: editPermission, document: docInfo } = response.data;
            
            setContentType(type);
            setContent(docContent);
            setOriginalContent(docContent);
            setCanEdit(editPermission);
            setDocument(docInfo);
            setError('');
        } catch (error) {
            setError('Error al cargar el documento');
            console.error('Error al obtener documento:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDocument();
    }, [fetchDocument]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put(`/api/documents/${id}/content`, {
                content,
                type: contentType
            });
            setOriginalContent(content);
            setSuccess('Documento guardado exitosamente');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Error al guardar el documento');
            console.error('Error al guardar:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await axios.get(`/api/documents/${id}/download`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', document?.nombre || `documento_${id}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setError('Error al descargar documento');
            console.error('Error al descargar:', error);
        }
    };

    const handleOpenExternal = async () => {
        try {
            const response = await axios.post(`/api/documents/${id}/open-external`);
            setSuccess(`${response.data.message}`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al abrir documento en editor externo';
            setError(errorMessage);
            console.error('Error al abrir en editor externo:', error);
        }
    };

    const isExternalEditorSupported = (format) => {
        const supportedFormats = ['doc', 'docx', 'pdf', 'xlsx', 'xls', 'csv', 'txt', 'rtf'];
        return supportedFormats.includes(format?.toLowerCase());
    };

    const hasChanges = JSON.stringify(content) !== JSON.stringify(originalContent);

    const renderContent = () => {
        switch (contentType) {
            case 'html':
                return (
                    <HTMLEditor
                        content={content}
                        onChange={setContent}
                        readOnly={!canEdit}
                    />
                );
            
            case 'spreadsheet':
                return (
                    <SpreadsheetEditor
                        content={content}
                        onChange={setContent}
                        readOnly={!canEdit}
                    />
                );
            
            case 'pdf':
                return <PDFViewer src={content} document={document} />;
            
            case 'image':
                return <ImageViewer src={content} document={document} />;
            
            case 'text':
                return (
                    <TextEditor
                        content={content}
                        onChange={setContent}
                        readOnly={!canEdit}
                    />
                );
            
            case 'unsupported':
                return (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        {content?.message || 'Formato no soportado para visualización en línea.'}
                        <br />
                        Use la opción de descarga para obtener el archivo.
                    </Alert>
                );
            
            default:
                return (
                    <Alert severity="warning">
                        Tipo de contenido desconocido: {contentType}
                    </Alert>
                );
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
                <Toolbar sx={{ px: 0, mb: 2 }}>
                    <Button
                        startIcon={<BackIcon />}
                        onClick={() => navigate('/documents')}
                        sx={{ mr: 2 }}
                    >
                        Volver
                    </Button>
                    
                    <Typography variant="h5" sx={{ flexGrow: 1 }}>
                        {document?.nombre || 'Visualizador de Documentos'}
                    </Typography>

                    {canEdit && hasChanges && (
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            disabled={saving}
                            sx={{ mr: 1 }}
                        >
                            {saving ? 'Guardando...' : 'Guardar'}
                        </Button>
                    )}

                    {/* Opción de Editor Avanzado oculta - mantenida para uso futuro */}
                    {/* {canEdit && ['html', 'text', 'spreadsheet'].includes(contentType) && (
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => navigate(`/documents/${id}/edit`)}
                            sx={{ mr: 1 }}
                        >
                            Editor Avanzado
                        </Button>
                    )} */}

                    {isExternalEditorSupported(document?.formato) && (
                        <Button
                            variant="outlined"
                            startIcon={<OpenExternalIcon />}
                            onClick={handleOpenExternal}
                            sx={{ mr: 1 }}
                            color="secondary"
                        >
                            Abrir en Editor Externo
                        </Button>
                    )}

                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                    >
                        Descargar
                    </Button>
                </Toolbar>

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

                <Paper sx={{ p: 2 }}>
                    {renderContent()}
                </Paper>

                {!canEdit && contentType !== 'unsupported' && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        {user?.rol === 'asesor' 
                            ? 'Solo puedes visualizar este documento. No tienes permisos de edición.'
                            : 'Documento en modo de solo lectura.'
                        }
                    </Alert>
                )}
            </Container>
        </Layout>
    );
};

export default DocumentViewer;