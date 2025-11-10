import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import './BrandSectionHome.css';

// --- Constants ko component ke bahar rakha gaya hai behtar performance ke liye ---
const WAVE_AMPLITUDE_BASE = 10;
const WAVE_FREQUENCY = 0.02;
const WAVE_SPEED_BASE = 0.005;
const MAX_RAIN_PARTICLES = 150;
const RAIN_SPEED_MIN = 5;
const RAIN_SPEED_MAX = 15;
const RAIN_LENGTH_MIN = 10;
const RAIN_LENGTH_MAX = 20;
const RAIN_COLOR = 'rgba(173, 216, 230, 0.7)';
const MAX_CLOUD_PARTICLES = 5;
const CLOUD_SPEED_MIN = 0.2;
const CLOUD_SPEED_MAX = 0.8;
const CLOUD_COLOR = 'rgba(200, 200, 200, 0.9)';
const LIGHTNING_COLOR = 'rgba(255, 255, 0, 0.8)';
const LIGHTNING_THICKNESS = 3;

const BrandSectionHome = () => {
    const navigate = useNavigate();
    
    // --- Refs for Canvases and Animation Control ---
    const containerRef = useRef(null);
    const waterCanvasRef = useRef(null);
    const rainCanvasRef = useRef(null);
    const cloudCanvasRef = useRef(null);
    const lightningCanvasRef = useRef(null);
    const animationFrameId = useRef(null);
    
    // --- State for Effects and Performance ---
    const [isFlashing, setIsFlashing] = useState(false);
    const [isInView, setIsInView] = useState(false);

    // --- Refs for Animation Data ---
    const wavePhase = useRef(0);
    const rainParticles = useRef([]);
    const cloudParticles = useRef([]);
    const currentTiltX = useRef(0);
    const currentTiltY = useRef(0);

    const resizeCanvases = useCallback(() => {
        const canvases = [waterCanvasRef.current, rainCanvasRef.current, cloudCanvasRef.current, lightningCanvasRef.current];
        const container = containerRef.current;
        if (canvases.every(Boolean) && container) {
            const width = container.clientWidth;
            const height = container.clientHeight;
            canvases.forEach(canvas => {
                canvas.width = width;
                canvas.height = canvas.id.includes('water') || canvas.id.includes('cloud') ? height / 2 : height;
            });
        }
    }, []);

    const createRainParticle = useCallback(() => {
        const rainCanvas = rainCanvasRef.current;
        if (!rainCanvas) return null;
        return {
            x: Math.random() * rainCanvas.width,
            y: -(Math.random() * rainCanvas.height),
            length: Math.random() * (RAIN_LENGTH_MAX - RAIN_LENGTH_MIN) + RAIN_LENGTH_MIN,
            speed: Math.random() * (RAIN_SPEED_MAX - RAIN_SPEED_MIN) + RAIN_SPEED_MIN
        };
    }, []);
    
    const createCloudParticle = useCallback(() => {
        const cloudCanvas = cloudCanvasRef.current;
        if (!cloudCanvas) return null;
        return {
            x: Math.random() * cloudCanvas.width,
            y: Math.random() * cloudCanvas.height * 0.5,
            size: Math.random() * 30 + 40,
            speed: Math.random() * (CLOUD_SPEED_MAX - CLOUD_SPEED_MIN) + CLOUD_SPEED_MIN
        };
    }, []);

    const animate = useCallback(() => {
        const waterCtx = waterCanvasRef.current?.getContext('2d');
        const rainCtx = rainCanvasRef.current?.getContext('2d');
        const cloudCtx = cloudCanvasRef.current?.getContext('2d');
        
        if (!waterCtx || !rainCtx || !cloudCtx) return;

        waterCtx.clearRect(0, 0, waterCtx.canvas.width, waterCtx.canvas.height);
        rainCtx.clearRect(0, 0, rainCtx.canvas.width, rainCtx.canvas.height);
        cloudCtx.clearRect(0, 0, cloudCtx.canvas.width, cloudCtx.canvas.height);

        rainParticles.current.forEach(p => {
            p.y += p.speed;
            if (p.y > rainCtx.canvas.height) Object.assign(p, createRainParticle());
            rainCtx.strokeStyle = RAIN_COLOR;
            rainCtx.lineWidth = 1;
            rainCtx.beginPath();
            rainCtx.moveTo(p.x, p.y);
            rainCtx.lineTo(p.x, p.y + p.length);
            rainCtx.stroke();
        });

        cloudParticles.current.forEach(p => {
            p.x += p.speed + currentTiltY.current * 0.05;
            if (p.x > cloudCtx.canvas.width + p.size * 2) p.x = -p.size * 2;
            if (p.x < -p.size * 2) p.x = cloudCtx.canvas.width + p.size * 2;
            cloudCtx.fillStyle = CLOUD_COLOR;
            cloudCtx.beginPath();
            cloudCtx.arc(p.x, p.y, p.size * 0.6, 0, 2 * Math.PI);
            cloudCtx.arc(p.x + p.size * 0.5, p.y + p.size * 0.2, p.size * 0.7, 0, 2 * Math.PI);
            cloudCtx.arc(p.x - p.size * 0.4, p.y + p.size * 0.1, p.size * 0.5, 0, 2 * Math.PI);
            cloudCtx.closePath();
            cloudCtx.fill();
        });

        const gradient = waterCtx.createLinearGradient(0, 0, 0, waterCtx.canvas.height);
        gradient.addColorStop(0, '#63b3ed');
        gradient.addColorStop(1, '#4299e1');
        waterCtx.fillStyle = gradient;
        waterCtx.beginPath();
        waterCtx.moveTo(0, waterCtx.canvas.height);
        const amp = WAVE_AMPLITUDE_BASE + (Math.abs(currentTiltX.current) + Math.abs(currentTiltY.current)) * 0.2;
        for (let x = 0; x <= waterCtx.canvas.width; x++) {
            const y = waterCtx.canvas.height / 2 + amp * Math.sin(x * WAVE_FREQUENCY + wavePhase.current) + currentTiltX.current * 0.5;
            waterCtx.lineTo(x, y);
        }
        waterCtx.lineTo(waterCtx.canvas.width, waterCtx.canvas.height);
        waterCtx.closePath();
        waterCtx.fill();
        wavePhase.current += WAVE_SPEED_BASE;

        if (Math.random() < 0.005) {
            const lightningCtx = lightningCanvasRef.current?.getContext('2d');
            if (lightningCtx) {
                setIsFlashing(true);
                const startX = Math.random() * lightningCtx.canvas.width;
                lightningCtx.strokeStyle = LIGHTNING_COLOR;
                lightningCtx.lineWidth = LIGHTNING_THICKNESS;
                lightningCtx.beginPath();
                lightningCtx.moveTo(startX, 0);
                for (let i = 0; i < 10; i++) lightningCtx.lineTo(startX + (Math.random() - 0.5) * 30, i * 20);
                lightningCtx.stroke();
                setTimeout(() => {
                    lightningCtx.clearRect(0, 0, lightningCtx.canvas.width, lightningCtx.canvas.height);
                    setIsFlashing(false);
                }, 150);
            }
        }
        
        animationFrameId.current = requestAnimationFrame(animate);
    }, [createRainParticle]);

    const handleOrientation = useCallback((event) => {
        const maxTilt = 30;
        currentTiltX.current = Math.max(-maxTilt, Math.min(maxTilt, event.beta || 0));
        currentTiltY.current = Math.max(-maxTilt, Math.min(maxTilt, event.gamma || 0));
    }, []);

    const handleArshaLogoClick = () => navigate('/ai-chat');
    const handleGleamGlamLogoClick = () => navigate('/product');

    useEffect(() => {
        resizeCanvases();
        rainParticles.current = Array.from({ length: MAX_RAIN_PARTICLES }, createRainParticle);
        cloudParticles.current = Array.from({ length: MAX_CLOUD_PARTICLES }, createCloudParticle);
        
        window.addEventListener('resize', resizeCanvases);
        window.addEventListener('deviceorientation', handleOrientation);

        const observer = new IntersectionObserver(([entry]) => {
            setIsInView(entry.isIntersecting);
        }, { threshold: 0.1 });

        const currentContainer = containerRef.current;
        if (currentContainer) {
            observer.observe(currentContainer);
        }

        return () => {
            window.removeEventListener('resize', resizeCanvases);
            window.removeEventListener('deviceorientation', handleOrientation);
            if (currentContainer) {
                observer.unobserve(currentContainer);
            }
        };
    }, [resizeCanvases, createRainParticle, createCloudParticle, handleOrientation]);

    useEffect(() => {
        if (isInView) {
            animationFrameId.current = requestAnimationFrame(animate);
        } else {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        }
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isInView, animate]);

    return (
        <div ref={containerRef} className={`ww-container ${isFlashing ? 'ww-dim' : ''}`}>
            <canvas ref={waterCanvasRef} id="ww-waterCanvas"></canvas>
            <canvas ref={cloudCanvasRef} id="ww-cloudCanvas"></canvas>
            <canvas ref={rainCanvasRef} id="ww-rainCanvas"></canvas>
            <canvas ref={lightningCanvasRef} id="ww-lightningCanvas"></canvas>

            <div className="ww-brand-logos">
                <img 
                    src="./gleam&glame_logo.png" 
                    alt="Gleam & Glame Logo" 
                    onClick={handleGleamGlamLogoClick}
                    style={{ cursor: 'pointer' }}
                />
                <img
                    src="./arsha-ai.png"
                    alt="Arsha AI Logo"
                    onClick={handleArshaLogoClick}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </div>
    );
};

export default BrandSectionHome;