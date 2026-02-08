import React from 'react';
import {
    Paper,
    Box,
    Typography,
    Divider,
    useTheme,
    alpha
} from '@mui/material';

const ContentSection = ({ 
    title, 
    subtitle,
    icon,
    children, 
    color = 'primary',
    variant = 'default', // 'default', 'outlined', 'filled'
    spacing = 4,
    divider = false
}) => {
    const theme = useTheme();

    const getVariantStyles = () => {
        switch (variant) {
            case 'outlined':
                return {
                    border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
                    background: 'transparent'
                };
            case 'filled':
                return {
                    background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`
                };
            default:
                return {
                    background: theme.palette.background.paper,
                    border: 'none'
                };
        }
    };

    return (
        <Box sx={{ mb: spacing }}>
            {title && (
                <>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 600, 
                            mb: subtitle ? 1 : 3,
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1 
                        }}
                    >
                        {icon && icon} {title}
                    </Typography>
                    {subtitle && (
                        <Typography 
                            variant="body1" 
                            color="text.secondary" 
                            sx={{ mb: 3 }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </>
            )}
            
            <Paper 
                sx={{ 
                    borderRadius: 3,
                    ...getVariantStyles()
                }}
            >
                <Box sx={{ p: variant === 'filled' ? 3 : 0 }}>
                    {children}
                </Box>
            </Paper>
            
            {divider && <Divider sx={{ my: 4 }} />}
        </Box>
    );
};

export default ContentSection;