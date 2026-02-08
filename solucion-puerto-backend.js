const { exec } = require('child_process');
const net = require('net');
const os = require('os');

class BackendPortSolution {
    constructor() {
        this.port = 5001;
        this.host = '0.0.0.0';
    }

    // Verificar si el puerto está disponible
    async checkPortAvailable(port) {
        return new Promise((resolve) => {
            const server = net.createServer();
            
            server.listen(port, (err) => {
                if (err) {
                    resolve(false);
                } else {
                    server.once('close', () => resolve(true));
                    server.close();
                }
            });
            
            server.on('error', () => resolve(false));
        });
    }

    // Obtener procesos que usan el puerto
    async getProcessesUsingPort(port) {
        return new Promise((resolve) => {
            exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
                if (error) {
                    resolve([]);
                    return;
                }
                
                const lines = stdout.split('\n').filter(line => line.trim());
                const processes = lines.map(line => {
                    const parts = line.trim().split(/\s+/);
                    return {
                        protocol: parts[0],
                        localAddress: parts[1],
                        foreignAddress: parts[2],
                        state: parts[3],
                        pid: parts[4]
                    };
                }).filter(p => p.pid && p.pid !== '0');
                
                resolve(processes);
            });
        });
    }

    // Terminar procesos que usan el puerto
    async killProcessesOnPort(port) {
        const processes = await this.getProcessesUsingPort(port);
        
        for (const process of processes) {
            if (process.pid && process.pid !== '0') {
                try {
                    await this.executeCommand(`taskkill /PID ${process.pid} /F`);
                    console.log(`✓ Proceso ${process.pid} terminado`);
                } catch (error) {
                    console.log(`⚠️  No se pudo terminar proceso ${process.pid}: ${error.message}`);
                }
            }
        }
    }

    // Ejecutar comando
    executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });
    }

    // Configurar firewall de Windows
    async configureWindowsFirewall() {
        console.log('🔥 Configurando Firewall de Windows...');
        
        try {
            // Eliminar reglas existentes
            await this.executeCommand(`netsh advfirewall firewall delete rule name="SGD Backend Port ${this.port}"`);
        } catch (error) {
            // Ignorar error si la regla no existe
        }

        try {
            // Crear regla de entrada
            await this.executeCommand(`netsh advfirewall firewall add rule name="SGD Backend Port ${this.port}" dir=in action=allow protocol=TCP localport=${this.port}`);
            console.log(`✓ Regla de firewall creada para puerto ${this.port}`);
        } catch (error) {
            console.log(`❌ Error al configurar firewall: ${error.message}`);
            console.log('⚠️  Ejecuta el script como administrador para configurar el firewall');
        }
    }

    // Obtener IP local
    getLocalIP() {
        const interfaces = os.networkInterfaces();
        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
                }
            }
        }
        return 'localhost';
    }

    // Verificar conectividad
    async testConnectivity() {
        console.log('🔍 Verificando conectividad...');
        
        const localIP = this.getLocalIP();
        const urls = [
            `http://localhost:${this.port}/api/health`,
            `http://127.0.0.1:${this.port}/api/health`,
            `http://${localIP}:${this.port}/api/health`
        ];

        for (const url of urls) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    console.log(`✓ Backend accesible en: ${url}`);
                } else {
                    console.log(`⚠️  Backend responde con error en: ${url} (${response.status})`);
                }
            } catch (error) {
                console.log(`❌ No se puede acceder a: ${url}`);
            }
        }
    }

    // Solución completa
    async implementSolution() {
        console.log('========================================');
        console.log('    SOLUCION PUERTO BACKEND 5001');
        console.log('========================================\n');

        // 1. Verificar disponibilidad del puerto
        console.log('[1/5] Verificando disponibilidad del puerto...');
        const isAvailable = await this.checkPortAvailable(this.port);
        
        if (!isAvailable) {
            console.log(`⚠️  Puerto ${this.port} está en uso`);
            console.log('[1.1] Terminando procesos que usan el puerto...');
            await this.killProcessesOnPort(this.port);
            
            // Verificar nuevamente
            const isNowAvailable = await this.checkPortAvailable(this.port);
            if (isNowAvailable) {
                console.log(`✓ Puerto ${this.port} ahora está disponible`);
            } else {
                console.log(`❌ No se pudo liberar el puerto ${this.port}`);
            }
        } else {
            console.log(`✓ Puerto ${this.port} está disponible`);
        }

        // 2. Configurar firewall
        console.log('\n[2/5] Configurando firewall...');
        await this.configureWindowsFirewall();

        // 3. Mostrar información de red
        console.log('\n[3/5] Información de red:');
        const localIP = this.getLocalIP();
        console.log(`📍 IP Local: ${localIP}`);
        console.log(`🔗 URL Local: http://localhost:${this.port}`);
        console.log(`🌐 URL Remota: http://${localIP}:${this.port}`);

        // 4. Verificar configuración del backend
        console.log('\n[4/5] Verificando configuración del backend...');
        try {
            const fs = require('fs');
            const envPath = './backend/.env';
            
            if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, 'utf8');
                if (envContent.includes(`PORT=${this.port}`)) {
                    console.log('✓ Puerto configurado correctamente en .env');
                } else {
                    console.log('⚠️  Actualizando configuración de puerto en .env');
                    const updatedContent = envContent.replace(/PORT=\d+/, `PORT=${this.port}`);
                    fs.writeFileSync(envPath, updatedContent);
                }
            } else {
                console.log('⚠️  Archivo .env no encontrado, creando configuración por defecto...');
                const defaultEnv = `PORT=${this.port}
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sgd
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_2024`;
                fs.writeFileSync(envPath, defaultEnv);
                console.log('✓ Archivo .env creado');
            }
        } catch (error) {
            console.log(`❌ Error al verificar configuración: ${error.message}`);
        }

        // 5. Instrucciones finales
        console.log('\n[5/5] Solución implementada');
        console.log('\n========================================');
        console.log('           PASOS SIGUIENTES');
        console.log('========================================');
        console.log('1. Ejecutar: iniciar-backend-completo.bat');
        console.log('2. Verificar: verificar-puerto-backend.bat');
        console.log('3. Probar conectividad desde el frontend');
        console.log('\n✓ Configuración completada exitosamente');
    }
}

// Ejecutar la solución
if (require.main === module) {
    const solution = new BackendPortSolution();
    solution.implementSolution().catch(console.error);
}

module.exports = BackendPortSolution;