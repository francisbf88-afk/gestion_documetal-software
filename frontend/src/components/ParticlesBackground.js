import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const ParticlesBackground = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const particlesRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Configurar el canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Configuración de partículas
        const particleCount = 60;
        const maxDistance = 150;
        
        // Crear partículas
        const createParticles = () => {
            particlesRef.current = [];
            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 1.2,
                    vy: (Math.random() - 0.5) * 1.2,
                    size: Math.random() * 3 + 1,
                    opacity: Math.random() * 0.6 + 0.3,
                    color: Math.random() > 0.7 ? 'cyan' : 'white',
                    pulseSpeed: Math.random() * 0.02 + 0.01,
                    pulsePhase: Math.random() * Math.PI * 2,
                });
            }
        };

        createParticles();

        let time = 0;

        // Función de animación
        const animate = () => {
            time += 0.016; // ~60fps
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Actualizar y dibujar partículas
            particlesRef.current.forEach((particle, i) => {
                // Actualizar posición
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Rebotar en los bordes con suavidad
                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.vx *= -0.8;
                    particle.x = Math.max(0, Math.min(canvas.width, particle.x));
                }
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.vy *= -0.8;
                    particle.y = Math.max(0, Math.min(canvas.height, particle.y));
                }
                
                // Efecto de pulsación
                const pulseSize = particle.size + Math.sin(time * particle.pulseSpeed + particle.pulsePhase) * 0.5;
                const pulseOpacity = particle.opacity + Math.sin(time * particle.pulseSpeed + particle.pulsePhase) * 0.1;
                
                // Dibujar partícula con brillo
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
                
                // Color base
                if (particle.color === 'cyan') {
                    ctx.fillStyle = `rgba(0, 255, 255, ${pulseOpacity})`;
                    ctx.shadowColor = 'rgba(0, 255, 255, 0.6)';
                } else {
                    ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
                    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
                }
                
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;
                
                // Dibujar líneas de conexión dinámicas
                particlesRef.current.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.4;
                        const lineWidth = (1 - distance / maxDistance) * 1.5;
                        
                        // Gradiente para las líneas
                        const gradient = ctx.createLinearGradient(
                            particle.x, particle.y, 
                            otherParticle.x, otherParticle.y
                        );
                        
                        if (particle.color === 'cyan' || otherParticle.color === 'cyan') {
                            gradient.addColorStop(0, `rgba(0, 255, 255, ${opacity})`);
                            gradient.addColorStop(1, `rgba(173, 216, 230, ${opacity * 0.7})`);
                        } else {
                            gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
                            gradient.addColorStop(1, `rgba(173, 216, 230, ${opacity * 0.8})`);
                        }
                        
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = lineWidth;
                        ctx.stroke();
                        
                        // Efecto de brillo en las líneas
                        if (distance < maxDistance * 0.5) {
                            ctx.shadowBlur = 3;
                            ctx.shadowColor = particle.color === 'cyan' ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)';
                            ctx.stroke();
                            ctx.shadowBlur = 0;
                        }
                    }
                });
            });
            
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                zIndex: 1,
                pointerEvents: 'none',
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
            />
        </Box>
    );
};

export default ParticlesBackground;