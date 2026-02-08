import React from 'react';
import {
    Paper,
    Box,
    Typography,
    Button,
    Chip,
    useTheme,
    alpha
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Security as SecurityIcon
} from '@mui/icons-material';

const PageHeader = ({ 
    title, 
    subtitle, 
    icon, 
    onBack, 
    backLabel = "Volver",
    userRole,
    actions = [],
    color = 'primary'
}) => {
    const theme = useTheme();

    const getRoleInfo = (role) => {
        switch (role) {
            case 'admin':
                return { label: 'Administrador', color: 'error' };
            case 'editor':
                return { label: 'Editor', color: 'warning' };
            case 'asesor':
                return { label: 'Asesor', color: 'info' };
            default:
                return { label: role, color: 'default' };
        }
    };

    const roleInfo = getRoleInfo(userRole);

    return (
        <Paper 
            elevation={0}
            sx={{ 
                p: 3, 
                mb: 4,
                background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.05)} 0%, ${alpha(theme.palette[color].main, 0.02)} 100%)`,
                border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
                borderRadius: 3
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                    {onBack && (
                        <Button
                            startIcon={<BackIcon />}
                            onClick={onBack}
                            sx={{ mr: 3 }}
                            variant="outlined"
                            size="small"
                        >
                            {backLabel}
                        </Button>
                    )}
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {icon && `${icon} `}{title}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body1" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                    {userRole && (
                        <Chip
                            icon={<SecurityIcon />}
                            label={roleInfo.label}
                            color={roleInfo.color}
                            variant="filled"
                        />
                    )}
                    {actions.map((action, index) => (
                        <React.Fragment key={index}>
                            {action}
                        </React.Fragment>
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

export default PageHeader;