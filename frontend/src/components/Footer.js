import React from 'react';
import { Box, Typography, Container, useTheme, useMediaQuery } from '@mui/material';

const Footer = ({ drawerOpen = false, drawerWidth = 280 }) => {
    const currentYear = new Date().getFullYear();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box
            component="footer"
            sx={{
                position: 'fixed',
                bottom: 0,
                left: { 
                    xs: 0, 
                    md: drawerOpen && !isMobile ? `${drawerWidth}px` : 0 
                },
                right: 0,
                backgroundColor: 'primary.main',
                color: 'white',
                py: 1.5,
                borderRadius: 0, // Sin bordes redondeados
                boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
                zIndex: (theme) => theme.zIndex.appBar - 1, // Debajo del AppBar pero encima del contenido
                transition: theme.transitions.create(['left'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            }}
        >
            <Container maxWidth="lg">
                <Typography 
                    variant="body2" 
                    align="center"
                    sx={{ 
                        fontWeight: 500,
                        fontSize: '0.9rem'
                    }}
                >
                    © {currentYear} PROCOVAR S.R.L - Todos los derechos reservados
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;