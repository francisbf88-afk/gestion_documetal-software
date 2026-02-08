import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    Alert,
    CircularProgress,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tabs,
    Tab
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Save as SaveIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    OpenInNew as OpenExternalIcon
} from '@mui/icons-material';
import Layout from './Layout';
import axios from 'axios';

const DocumentEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [document, setDocument] = useState(null);
    const [content, setContent] = useState('');
    const [originalContent, setOriginalContent] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [canEdit, setCanEdit] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    const fetchDocumentContent = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/documents/${id}/content`);
            
            setDocument(response.data.document);
            setCanEdit(response.data.canEdit);
            setDocumentType(response.data.type);

            if (response.data.type === 'text') {
                setContent(response.data.content);
                setOriginalContent(response.data.content);
            } else if (response.data.type === 'html') {
                setContent(response.data.content);
                setOriginalContent(response.data.content);
            } else if (response.data.type === 'spreadsheet') {
                setContent(response.data.content);
                setOriginalContent(JSON.stringify(response.data.content));
            } else if (response.data.type === 'pdf') {
                setContent(response.data.content); // URL del PDF
                setOriginalContent(response.data.content);
            } else {
                setError('Este tipo de documento no es compatible con el editor.');
            }

        } catch (error) {
            setError('Error al cargar el documento');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDocumentContent();
    }, [fetchDocumentContent]);

    const handleSave = async () => {
        try {
            setSaving(true);
            let saveContent = content;
            let saveType = documentType;

            // Preparar contenido según el tipo
            if (documentType === 'spreadsheet') {
                try {
                    saveContent = JSON.parse(content);
                } catch (e) {
                    setError('Error en el formato de la hoja de cálculo');
                    return;
                }
            }

            await axios.put(`/api/documents/${id}/content`, {
                content: saveContent,
                type: saveType
            });
            
            setSuccess('Documento guardado exitosamente');
            setOriginalContent(documentType === 'spreadsheet' ? JSON.stringify(saveContent) : content);
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Error al guardar el documento');
        } finally {
            setSaving(false);
        }
    };

    const hasChanges = content !== originalContent;

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

    const isExternalEditorSupported = (formato) => {
        const supportedFormats = ['doc', 'docx', 'pdf', 'xlsx', 'xls', 'csv', 'txt', 'rtf'];
        return supportedFormats.includes(formato?.toLowerCase());
    };

    // Funciones para manejar hojas de cálculo
    const addRow = () => {
        if (documentType === 'spreadsheet') {
            try {
                const data = JSON.parse(content);
                const newRow = new Array(data[0]?.length || 3).fill('');
                data.push(newRow);
                setContent(JSON.stringify(data));
            } catch (e) {
                setError('Error al agregar fila');
            }
        }
    };

    const addColumn = () => {
        if (documentType === 'spreadsheet') {
            try {
                const data = JSON.parse(content);
                data.forEach(row => row.push(''));
                setContent(JSON.stringify(data));
            } catch (e) {
                setError('Error al agregar columna');
            }
        }
    };

    const updateCell = (rowIndex, colIndex, value) => {
        if (documentType === 'spreadsheet') {
            try {
                const data = JSON.parse(content);
                data[rowIndex][colIndex] = value;
                setContent(JSON.stringify(data));
            } catch (e) {
                setError('Error al actualizar celda');
            }
        }
    };

    const deleteRow = (rowIndex) => {
        if (documentType === 'spreadsheet') {
            try {
                const data = JSON.parse(content);
                if (data.length > 1) {
                    data.splice(rowIndex, 1);
                    setContent(JSON.stringify(data));
                }
            } catch (e) {
                setError('Error al eliminar fila');
            }
        }
    };

    // Componente para editor de texto
    const TextEditor = () => (
        <TextField
            multiline
            fullWidth
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="outlined"
            sx={{ 
                '& .MuiInputBase-root': {
                    fontFamily: 'monospace',
                    fontSize: '14px'
                }
            }}
        />
    );

    // Componente para editor HTML (documentos Word)
    const HtmlEditor = () => (
        <Box>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
                <Tab label="Vista Previa" />
                <Tab label="Código HTML" />
            </Tabs>
            {tabValue === 0 ? (
                <Box
                    sx={{
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        p: 2,
                        minHeight: '400px',
                        backgroundColor: '#fff'
                    }}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            ) : (
                <TextField
                    multiline
                    fullWidth
                    rows={20}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    variant="outlined"
                    sx={{ 
                        '& .MuiInputBase-root': {
                            fontFamily: 'monospace',
                            fontSize: '12px'
                        }
                    }}
                />
            )}
        </Box>
    );

    // Componente para editor de hojas de cálculo
    const SpreadsheetEditor = () => {
        let data = [];
        try {
            data = JSON.parse(content);
        } catch (e) {
            data = [['']];
        }

        return (
            <Box>
                <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                    <Button
                        startIcon={<AddIcon />}
                        onClick={addRow}
                        variant="outlined"
                        size="small"
                    >
                        Agregar Fila
                    </Button>
                    <Button
                        startIcon={<AddIcon />}
                        onClick={addColumn}
                        variant="outlined"
                        size="small"
                    >
                        Agregar Columna
                    </Button>
                </Box>
                <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell width={50}>#</TableCell>
                                {data[0]?.map((_, colIndex) => (
                                    <TableCell key={colIndex} width={150}>
                                        {String.fromCharCode(65 + colIndex)}
                                    </TableCell>
                                ))}
                                <TableCell width={50}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    <TableCell>{rowIndex + 1}</TableCell>
                                    {row.map((cell, colIndex) => (
                                        <TableCell key={colIndex}>
                                            <TextField
                                                value={cell || ''}
                                                onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                                                variant="standard"
                                                size="small"
                                                fullWidth
                                            />
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <IconButton
                                            onClick={() => deleteRow(rowIndex)}
                                            disabled={data.length <= 1}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    };

    // Componente para visor de PDF
    const PdfViewer = () => (
        <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
                Los archivos PDF no son editables. Puedes visualizarlos pero no modificar su contenido.
            </Alert>
            <Box
                sx={{
                    width: '100%',
                    height: '600px',
                    border: '1px solid #ccc',
                    borderRadius: 1
                }}
            >
                <iframe
                    src={content}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    title="PDF Viewer"
                />
            </Box>
        </Box>
    );

    // Función para renderizar el editor apropiado
    const renderEditor = () => {
        if (!canEdit && documentType !== 'pdf') {
            return (
                <Typography>
                    No tienes permisos para editar este documento.
                </Typography>
            );
        }

        switch (documentType) {
            case 'text':
                return <TextEditor />;
            case 'html':
                return <HtmlEditor />;
            case 'spreadsheet':
                return <SpreadsheetEditor />;
            case 'pdf':
                return <PdfViewer />;
            default:
                return (
                    <Alert severity="warning">
                        Tipo de documento no soportado: {documentType}
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
                <Box display="flex" alignItems="center" mb={3}>
                    <Button
                        startIcon={<BackIcon />}
                        onClick={() => navigate('/documents')}
                        sx={{ mr: 2 }}
                    >
                        Volver
                    </Button>
                    <Box flexGrow={1}>
                        <Typography variant="h4">
                            Editor: {document?.nombre}
                        </Typography>
                    </Box>
                    {isExternalEditorSupported(document?.formato) && (
                        <Button
                            variant="outlined"
                            startIcon={<OpenExternalIcon />}
                            onClick={handleOpenExternal}
                            sx={{ mr: 2 }}
                            color="secondary"
                        >
                            Abrir en Editor Externo
                        </Button>
                    )}
                    {canEdit && hasChanges && (
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            disabled={saving || documentType === 'pdf'}
                        >
                            {saving ? 'Guardando...' : 'Guardar'}
                        </Button>
                    )}
                </Box>

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

                {hasChanges && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Tienes cambios sin guardar.
                    </Alert>
                )}

                <Paper sx={{ p: 3 }}>
                    {renderEditor()}
                </Paper>
            </Container>
        </Layout>
    );
};

export default DocumentEditor;