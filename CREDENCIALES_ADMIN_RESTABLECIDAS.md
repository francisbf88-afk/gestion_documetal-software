# ✅ CONTRASEÑA DE ADMIN RESTABLECIDA

## Credenciales Actualizadas

```
Usuario:     admin
Contraseña:  admin123
Rol:         Administrador
```

## Verificación Exitosa

✅ La contraseña ha sido restablecida y verificada correctamente
✅ El usuario admin puede iniciar sesión sin problemas
✅ El token JWT se genera correctamente

## URLs de Acceso

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5001/api

## Scripts Disponibles

### Para Restablecer Contraseña en el Futuro

#### Opción 1: Reset Rápido (Recomendado)
```bash
# Restablece a admin123 automáticamente
node reset-admin-rapido.js

# O usando el archivo batch
restablecer-admin.bat
```

#### Opción 2: Reset Interactivo
```bash
# Permite elegir contraseña personalizada
node restablecer-password-admin.js
```

### Para Verificar Login
```bash
# Verifica que el login funcione correctamente
node verificar-login-admin.js
```

## Otros Usuarios Disponibles

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| editor | editor123 | Editor |
| asesor | asesor123 | Asesor |

## Información Adicional

### Cambiar Contraseña desde la Aplicación

Una vez que inicies sesión como admin, puedes cambiar tu contraseña desde:
1. Dashboard → Perfil de Usuario
2. Usar la opción "Cambiar Contraseña"

### Cambiar Contraseña desde la Base de Datos

Si necesitas cambiar la contraseña directamente:

```bash
# Usar el script interactivo
node restablecer-password-admin.js
```

Selecciona la opción 2 para establecer una contraseña personalizada.

## Solución de Problemas

### Si no puedes iniciar sesión:

1. **Verificar que el backend esté ejecutándose**:
   ```bash
   netstat -an | findstr :5001
   ```

2. **Iniciar el backend si no está activo**:
   ```bash
   cd backend
   node server.js
   ```

3. **Limpiar caché del navegador**:
   - Chrome/Firefox: `Ctrl+Shift+R`
   - Modo incógnito: `Ctrl+Shift+N`

4. **Restablecer contraseña nuevamente**:
   ```bash
   node reset-admin-rapido.js
   ```

## Seguridad

⚠️ **IMPORTANTE**: 
- La contraseña por defecto `admin123` es solo para desarrollo
- En producción, cambia la contraseña a una más segura
- Usa contraseñas de al menos 12 caracteres con mayúsculas, minúsculas, números y símbolos

## Fecha de Restablecimiento

**Fecha**: 2 de febrero de 2026
**Estado**: ✅ Contraseña restablecida y verificada exitosamente