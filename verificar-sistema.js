const { pool } = require('./backend/config/database');
const axios = require('axios');

class SystemVerifier {
    constructor() {
        this.checks = {
            database: false,
            backend: false,
            frontend: false,
            users: false
        };
    }

    async checkDatabase() {
        console.log('🔍 Verificando base de datos...');
        try {
            const client = await pool.connect();
            console.log('  ✅ Conexión a PostgreSQL exitosa');
            
            // Verificar tablas
            const tables = await client.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            `);
            
            console.log(`  ✅ Tablas encontradas: ${tables.rows.length}`);
            tables.rows.forEach(row => {
                console.log(`     - ${row.table_name}`);
            });
            
            client.release();
            this.checks.database = true;
            return true;
        } catch (error) {
            console.log('  ❌ Error de base de datos:', error.message);
            return false;
        }
    }

    async checkUsers() {
        console.log('\n🔍 Verificando usuarios...');
        try {
            const result = await pool.query('SELECT COUNT(*) as count FROM usuarios');
            const count = parseInt(result.rows[0].count);
            
            if (count > 0) {
                console.log(`  ✅ Usuarios encontrados: ${count}`);
                
                const users = await pool.query(
                    'SELECT username, rol FROM usuarios ORDER BY id'
                );
                users.rows.forEach(user => {
                    console.log(`     - ${user.username} (${user.rol})`);
                });
                
                this.checks.users = true;
                return true;
            } else {
                console.log('  ⚠️  No hay usuarios en el sistema');
                console.log('     Ejecuta: node crear-usuarios.js');
                return false;
            }
        } catch (error) {
            console.log('  ❌ Error verificando usuarios:', error.message);
            return false;
        }
    }

    async checkBackend() {
        console.log('\n🔍 Verificando backend...');
        try {
            const response = await axios.get('http://localhost:5001/api/health', {
                timeout: 5000
            });
            
            if (response.status === 200) {
                console.log('  ✅ Backend respondiendo correctamente');
                console.log(`     Status: ${response.data.status}`);
                console.log(`     Message: ${response.data.message}`);
                this.checks.backend = true;
                return true;
            }
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.log('  ❌ Backend no está ejecutándose');
                console.log('     Ejecuta: cd backend && npm start');
            } else {
                console.log('  ❌ Error conectando al backend:', error.message);
            }
            return false;
        }
    }

    async checkFrontend() {
        console.log('\n🔍 Verificando frontend...');
        try {
            const response = await axios.get('http://localhost:3001', {
                timeout: 5000
            });
            
            if (response.status === 200) {
                console.log('  ✅ Frontend respondiendo correctamente');
                this.checks.frontend = true;
                return true;
            }
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.log('  ❌ Frontend no está ejecutándose');
                console.log('     Ejecuta: cd frontend && npm start');
            } else {
                console.log('  ❌ Error conectando al frontend:', error.message);
            }
            return false;
        }
    }

    async testLogin() {
        console.log('\n🔍 Probando login...');
        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', {
                username: 'admin',
                password: 'admin123'
            });

            if (response.status === 200 && response.data.token) {
                console.log('  ✅ Login funcionando correctamente');
                console.log(`     Usuario: ${response.data.user.nombre}`);
                console.log(`     Rol: ${response.data.user.rol}`);
                return true;
            }
        } catch (error) {
            console.log('  ❌ Error en login:', error.response?.data?.message || error.message);
            return false;
        }
    }

    showSummary() {
        console.log('\n========================================');
        console.log('   RESUMEN DE VERIFICACION');
        console.log('========================================\n');

        const status = (check) => check ? '✅' : '❌';
        
        console.log(`${status(this.checks.database)} Base de datos`);
        console.log(`${status(this.checks.users)} Usuarios`);
        console.log(`${status(this.checks.backend)} Backend`);
        console.log(`${status(this.checks.frontend)} Frontend`);

        const allChecks = Object.values(this.checks).every(check => check);

        console.log('\n========================================');
        if (allChecks) {
            console.log('✅ SISTEMA FUNCIONANDO CORRECTAMENTE');
            console.log('========================================\n');
            console.log('URLs de acceso:');
            console.log('  Backend:  http://localhost:5001');
            console.log('  Frontend: http://localhost:3001\n');
            console.log('Credenciales:');
            console.log('  admin / admin123');
        } else {
            console.log('⚠️  SISTEMA CON PROBLEMAS');
            console.log('========================================\n');
            console.log('Pasos para solucionar:\n');
            
            if (!this.checks.database) {
                console.log('1. Verificar PostgreSQL:');
                console.log('   - Asegurar que PostgreSQL esté ejecutándose');
                console.log('   - Ejecutar: setup-database.bat\n');
            }
            
            if (!this.checks.users) {
                console.log('2. Crear usuarios:');
                console.log('   - Ejecutar: node crear-usuarios.js\n');
            }
            
            if (!this.checks.backend) {
                console.log('3. Iniciar backend:');
                console.log('   - Ejecutar: cd backend && npm start\n');
            }
            
            if (!this.checks.frontend) {
                console.log('4. Iniciar frontend:');
                console.log('   - Ejecutar: cd frontend && npm start\n');
            }
        }
    }

    async run() {
        console.log('========================================');
        console.log('   VERIFICACION DEL SISTEMA');
        console.log('========================================\n');

        await this.checkDatabase();
        
        if (this.checks.database) {
            await this.checkUsers();
        }
        
        await this.checkBackend();
        
        if (this.checks.backend) {
            await this.testLogin();
        }
        
        await this.checkFrontend();
        
        this.showSummary();
    }
}

// Ejecutar verificación
if (require.main === module) {
    const verifier = new SystemVerifier();
    verifier.run().catch(console.error);
}

module.exports = SystemVerifier;
