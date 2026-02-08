#!/bin/bash

# ========================================
# Script de Despliegue Automático - Render.com
# Sistema de Gestión Documental (SGD)
# ========================================

echo "🚀 Iniciando despliegue automático en Render.com"
echo "================================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_step() {
    echo -e "${BLUE}[PASO $1]${NC} $2"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Verificar que Git esté instalado
if ! command -v git &> /dev/null; then
    print_error "Git no está instalado. Por favor instala Git primero."
    exit 1
fi

print_success "Git está instalado"

# ========================================
# PASO 1: Preparar archivos de configuración
# ========================================
print_step "1" "Preparando archivos de configuración para Render..."

# Crear render.yaml para configuración automática
cat > render.yaml << 'EOF'
services:
  # Backend API
  - type: web
    name: sgd-backend
    env: node
    region: oregon
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: DATABASE_URL
        fromDatabase:
          name: sgd-database
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: CORS_ORIGIN
        sync: false
    healthCheckPath: /api/health

  # Frontend
  - type: web
    name: sgd-frontend
    env: static
    region: oregon
    plan: free
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/build
    envVars:
      - key: REACT_APP_API_URL
        value: https://sgd-backend.onrender.com
    routes:
      - type: rewrite
        source: /*
        destination: /index.html

databases:
  - name: sgd-database
    databaseName: sgd
    user: sgd_user
    plan: free
    region: oregon
EOF

print_success "Archivo render.yaml creado"

# ========================================
# PASO 2: Crear archivos de build
# ========================================
print_step "2" "Creando scripts de build..."

# Script de build para backend
cat > backend/build.sh << 'EOF'
#!/bin/bash
echo "📦 Instalando dependencias del backend..."
npm install

echo "✓ Backend listo para desplegar"
EOF

chmod +x backend/build.sh

# Script de build para frontend
cat > frontend/build.sh << 'EOF'
#!/bin/bash
echo "📦 Instalando dependencias del frontend..."
npm install

echo "🏗️ Construyendo aplicación React..."
npm run build

echo "✓ Frontend construido exitosamente"
EOF

chmod +x frontend/build.sh

print_success "Scripts de build creados"

# ========================================
# PASO 3: Crear script de migración de base de datos
# ========================================
print_step "3" "Creando script de migración de base de datos..."

cat > migrate-database.js << 'EOF'
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos desde DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function runMigrations() {
    console.log('🔄 Ejecutando migraciones...');
    
    try {
        // Leer y ejecutar schema.sql
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('📝 Ejecutando schema.sql...');
        await pool.query(schema);
        console.log('✓ Schema creado exitosamente');
        
        // Leer y ejecutar notifications-schema.sql
        const notificationsPath = path.join(__dirname, 'database', 'notifications-schema.sql');
        const notificationsSchema = fs.readFileSync(notificationsPath, 'utf8');
        
        console.log('📝 Ejecutando notifications-schema.sql...');
        await pool.query(notificationsSchema);
        console.log('✓ Notificaciones configuradas');
        
        // Crear usuario admin por defecto
        const bcrypt = require('bcryptjs');
        const adminPassword = await bcrypt.hash('admin123', 10);
        
        const checkAdmin = await pool.query(
            'SELECT id FROM usuarios WHERE username = $1',
            ['admin']
        );
        
        if (checkAdmin.rows.length === 0) {
            await pool.query(
                `INSERT INTO usuarios (nombre, username, email, password, rol)
                 VALUES ($1, $2, $3, $4, $5)`,
                ['Administrador', 'admin', 'admin@sistema.com', adminPassword, 'admin']
            );
            console.log('✓ Usuario admin creado');
        } else {
            console.log('ℹ Usuario admin ya existe');
        }
        
        console.log('✅ Migraciones completadas exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en migraciones:', error);
        process.exit(1);
    }
}

runMigrations();
EOF

print_success "Script de migración creado"

# ========================================
# PASO 4: Actualizar package.json raíz
# ========================================
print_step "4" "Actualizando configuración del proyecto..."

cat > package.json << 'EOF'
{
  "name": "sgd-sistema-gestion-documental",
  "version": "1.0.0",
  "description": "Sistema de Gestión Documental con PostgreSQL",
  "scripts": {
    "migrate": "node migrate-database.js",
    "postinstall": "cd backend && npm install && cd ../frontend && npm install"
  },
  "keywords": ["sgd", "documentos", "postgresql"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "pg": "^8.11.3"
  }
}
EOF

print_success "package.json actualizado"

# ========================================
# PASO 5: Crear .gitignore si no existe
# ========================================
print_step "5" "Configurando Git..."

if [ ! -f .gitignore ]; then
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
backend/node_modules/
frontend/node_modules/

# Environment variables
.env
.env.local
.env.production
backend/.env
frontend/.env

# Build
frontend/build/
dist/

# Uploads
backend/uploads/*
!backend/uploads/.gitkeep

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
EOF
    print_success ".gitignore creado"
else
    print_success ".gitignore ya existe"
fi

# ========================================
# PASO 6: Inicializar repositorio Git
# ========================================
print_step "6" "Inicializando repositorio Git..."

if [ ! -d .git ]; then
    git init
    print_success "Repositorio Git inicializado"
else
    print_success "Repositorio Git ya existe"
fi

git add .
git commit -m "Preparar para despliegue en Render" || print_warning "No hay cambios para commitear"

# ========================================
# PASO 7: Instrucciones para GitHub
# ========================================
print_step "7" "Preparando para subir a GitHub..."

echo ""
echo "================================================"
echo "📋 INSTRUCCIONES PARA COMPLETAR EL DESPLIEGUE"
echo "================================================"
echo ""
echo "1️⃣  CREAR REPOSITORIO EN GITHUB:"
echo "   - Ve a: https://github.com/new"
echo "   - Nombre: sgd-sistema-documental"
echo "   - Tipo: Público o Privado"
echo "   - NO inicialices con README"
echo ""
echo "2️⃣  SUBIR CÓDIGO A GITHUB:"
echo "   Ejecuta estos comandos (reemplaza TU-USUARIO):"
echo ""
echo "   git remote add origin https://github.com/TU-USUARIO/sgd-sistema-documental.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3️⃣  DESPLEGAR EN RENDER:"
echo "   - Ve a: https://render.com"
echo "   - Crea una cuenta (gratis)"
echo "   - Click en 'New +' → 'Blueprint'"
echo "   - Conecta tu repositorio de GitHub"
echo "   - Render detectará render.yaml automáticamente"
echo "   - Click en 'Apply'"
echo ""
echo "4️⃣  EJECUTAR MIGRACIONES:"
echo "   Una vez desplegado el backend:"
echo "   - Ve al dashboard de Render"
echo "   - Click en 'sgd-backend'"
echo "   - Ve a 'Shell'"
echo "   - Ejecuta: npm run migrate"
echo ""
echo "5️⃣  ACTUALIZAR URL DEL FRONTEND:"
echo "   - En Render, ve a 'sgd-frontend'"
echo "   - Ve a 'Environment'"
echo "   - Actualiza REACT_APP_API_URL con la URL del backend"
echo "   - Ejemplo: https://sgd-backend-xxxx.onrender.com"
echo "   - Click en 'Save Changes'"
echo ""
echo "================================================"
echo "✅ ARCHIVOS DE CONFIGURACIÓN CREADOS"
echo "================================================"
echo ""
echo "Archivos creados:"
echo "  ✓ render.yaml - Configuración de Render"
echo "  ✓ migrate-database.js - Script de migración"
echo "  ✓ backend/build.sh - Build del backend"
echo "  ✓ frontend/build.sh - Build del frontend"
echo "  ✓ package.json - Configuración raíz"
echo ""
echo "🎉 ¡Todo listo para desplegar!"
echo ""
echo "📚 Documentación de Render: https://render.com/docs"
echo ""
