#!/usr/bin/env node

/**
 * Generador de JWT Secret Seguro
 * 
 * Este script genera un JWT secret aleatorio y seguro
 * para usar en producción.
 */

const crypto = require('crypto');

console.log('\n========================================');
console.log('🔐 GENERADOR DE JWT SECRET');
console.log('========================================\n');

// Generar diferentes longitudes
const secrets = {
    '32 bytes (256 bits)': crypto.randomBytes(32).toString('hex'),
    '64 bytes (512 bits)': crypto.randomBytes(64).toString('hex'),
    '128 bytes (1024 bits)': crypto.randomBytes(128).toString('hex')
};

console.log('Secrets generados:\n');

Object.entries(secrets).forEach(([length, secret]) => {
    console.log(`${length}:`);
    console.log(secret);
    console.log('');
});

console.log('========================================');
console.log('📋 INSTRUCCIONES');
console.log('========================================\n');

console.log('1. Copia uno de los secrets de arriba');
console.log('2. En tu plataforma de despliegue:');
console.log('   - Render: Environment → Add Environment Variable');
console.log('   - Railway: Variables → New Variable');
console.log('3. Nombre: JWT_SECRET');
console.log('4. Valor: Pega el secret copiado');
console.log('5. Guarda los cambios\n');

console.log('⚠️  IMPORTANTE:');
console.log('   - NO compartas este secret con nadie');
console.log('   - NO lo subas a GitHub');
console.log('   - Usa un secret diferente para cada ambiente');
console.log('   - Guárdalo en un lugar seguro\n');

console.log('✅ Recomendación: Usa el secret de 64 bytes\n');

// Guardar en archivo temporal (opcional)
const fs = require('fs');
const recommendedSecret = secrets['64 bytes (512 bits)'];

try {
    fs.writeFileSync('.jwt-secret-temp.txt', recommendedSecret);
    console.log('💾 Secret guardado temporalmente en: .jwt-secret-temp.txt');
    console.log('   (Este archivo NO se subirá a Git)\n');
} catch (error) {
    console.log('⚠️  No se pudo guardar el archivo temporal\n');
}

console.log('========================================\n');
