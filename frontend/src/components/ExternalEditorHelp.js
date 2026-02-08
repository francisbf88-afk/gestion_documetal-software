import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Alert
} from '@mui/material';
import {
    Description as DocIcon,
    TableChart as ExcelIcon,
    PictureAsPdf as PdfIcon,
    InsertDriveFile as FileIcon,
    OpenInNew as OpenExternalIcon
} from '@mui/icons-material';

const ExternalEditorHelp = ({ open, onClose }) => {
    const supportedFormats = [
        {
            icon: <DocIcon color="primary" />,
            name: 'Documentos de Word',
            formats: ['.doc', '.docx'],
            description: 'Se abrirán en Microsoft Word o LibreOffice Writer'
        },
        {
            icon: <PdfIcon color="error" />,
            name: 'Documentos PDF',
            formats: ['.pdf'],
            description: 'Se abrirán en el visor de PDF predeterminado'
        },
        {
            icon: <ExcelIcon color="success" />,
            name: 'Hojas de Cálculo',
            formats: ['.xlsx', '.xls', '.csv'],
            description: 'Se abrirán en Microsoft Excel o LibreOffice Calc'
        },
        {
            icon: <FileIcon color="action" />,
            name: 'Archivos de Texto',
            formats: ['.txt', '.rtf'],
            description: 'Se abrirán en el editor de texto predeterminado'
        }
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <OpenExternalIcon color="primary" />
                    <Typography variant="h6">
                        Abrir en Editor Externo
                    </Typography>
                </Box>
            </DialogTitle>
            
            <DialogContent>
                <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                        Esta funcionalidad te permite abrir documentos directamente en las aplicaciones 
                        instaladas en tu computadora, como Microsoft Word, Excel, o tu editor de PDF favorito.
                    </Typography>
                </Alert>

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Formatos Soportados
                </Typography>
                
                <List>
                    {supportedFormats.map((format, index) => (
                        <ListItem key={index} sx={{ py: 1 }}>
                            <ListItemIcon>
                                {format.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="subtitle1">
                                            {format.name}
                                        </Typography>
                                        <Box>
                                            {format.formats.map((fmt, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={fmt}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ mr: 0.5, fontSize: '0.75rem' }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                }
                                secondary={format.description}
                            />
                        </ListItem>
                    ))}
                </List>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Cómo Usar
                </Typography>
                
                <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" paragraph>
                        1. <strong>Localiza el botón:</strong> Busca el icono <OpenExternalIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> 
                        "Abrir en Editor Externo" en la lista de documentos o en el visor de documentos.
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                        2. <strong>Haz clic:</strong> El documento se abrirá automáticamente en la aplicación 
                        predeterminada de tu sistema para ese tipo de archivo.
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                        3. <strong>Edita libremente:</strong> Realiza todos los cambios que necesites usando 
                        las herramientas completas de tu editor favorito.
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                        4. <strong>Guarda:</strong> Los cambios se guardan directamente en el archivo del servidor. 
                        No necesitas volver a subirlo.
                    </Typography>
                </Box>

                <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        <strong>Ventaja:</strong> Tendrás acceso a todas las funciones avanzadas de tu editor, 
                        como corrector ortográfico, formato avanzado, fórmulas complejas, y más.
                    </Typography>
                </Alert>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Notas Importantes
                </Typography>
                
                <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" paragraph>
                        • Solo aparece para documentos con formatos compatibles
                    </Typography>
                    <Typography variant="body2" paragraph>
                        • Requiere que tengas instalado un editor para el tipo de archivo
                    </Typography>
                    <Typography variant="body2" paragraph>
                        • Los cambios se sincronizan automáticamente con el servidor
                    </Typography>
                    <Typography variant="body2" paragraph>
                        • Funciona en Windows, macOS y Linux
                    </Typography>
                </Box>
            </DialogContent>
            
            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Entendido
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExternalEditorHelp;