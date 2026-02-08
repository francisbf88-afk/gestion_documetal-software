#!/bin/bash

# Script para configurar Railway usando CLI
# Ejecutar después de crear el proyecto en Railway

echo "========================================"
echo "   CONFIGURACION RAILWAY CLI"
echo "========================================"
echo ""

# Verificar Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI no encontrado"
    echo "Instalar con: npm install -g @railway/cli"
    exit 1
fi

echo "✅ Railway CLI encontrado"
echo ""

# Login
echo "[1/5] Login en Railway..."
railway login

# Link proyecto
echo ""
echo "[2/5] Conectar al proyecto..."
echo "Selecciona tu proyecto de Railway"
railway link

# Configurar variables del backend
echo ""
echo "[3/5] Configurando variables del backend..."
echo "Generando JWT Secret..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

railway variables set NODE_ENV=production
railway variables set JWT_SECRET=$JWT_SECRET
railway variables set PORT=5001

echo "✅ Variables del backend configuradas"

# Ejecutar migraciones
echo ""
echo "[4/5] Ejecutando migraciones..."
railway run psql < database/schema.sql
railway run psql < database/notifications-schema.sql

echo "✅ Migraciones ejecutadas"

# Crear usuarios
echo ""
echo "[5/5] Creando usuarios iniciales..."
railway run node crear-usuarios.js

echo ""
echo "========================================"
echo "   CONFIGURACION COMPLETADA"
echo "========================================"
echo ""
echo "✅ Backend configurado en Railway"
echo "✅ Base de datos migrada"
echo "✅ Usuarios creados"
echo ""
echo "PROXIMO PASO:"
echo "Configurar el frontend con la URL del backend"
echo ""
