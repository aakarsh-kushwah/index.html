import React, { useRef, useEffect, useState, useCallback } from 'react';
import './BrandsSection.css'; // Importing the CSS file

const BrandSection = ({ navigate, scrollToKitSection }) => {
    // Canvas elements ke liye Refs
    const waterCanvasRef = useRef(null);
    const rainCanvasRef = useRef(null);
    const cloudCanvasRef = useRef(null);
    const lightningCanvasRef = useRef(null);

    // ... (baaki saare states aur functions waise hi rahenge, unmein koi badlav nahi) ...
    const [messageBoxVisible, setMessageBoxVisible] = useState(false);
    const [messageTitle, setMessageTitle] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [isFlashing, setIsFlashing] = useState(false);
    const animationFrameId = useRef(null);
    const wavePhase = useRef(0);
    const rainParticles = useRef([]);
    const cloudParticles = useRef([]);
    const lightningVisible = useRef(false);
    const currentTiltX = useRef(0);
    const currentTiltY = useRef(0);
    const largeWaveActive = useRef(false);
    const largeWaveCurrentPhase = useRef(0);
    const splashParticles = useRef([]);
    const waveAmplitudeBase = 10;
    const waveFrequency = 0.02;
    const waveSpeedBase = 0.005;
    const maxRainParticles = 150;
    const rainSpeedMin = 5;
    const rainSpeedMax = 15;
    const rainLengthMin = 10;
    const rainLengthMax = 20;
    const rainColor = 'rgba(173, 216, 230, 0.7)';
    const maxCloudParticles = 5;
    const cloudSpeedMin = 0.2;
    const cloudSpeedMax = 0.8;
    const cloudColor = 'rgba(200, 200, 200, 0.9)';
    const lightningColor = 'rgba(255, 255, 0, 0.8)';
    const lightningThickness = 3;
    const lightningMaxSegments = 10;
    const lightningSegmentLength = 20;
    const lightningOffset = 15;
    const largeWaveAmplitude = 40;
    const largeWaveFrequency = 0.08;
    const largeWaveSpeed = 0.2;
    const largeWaveDuration = 1500;
    const largeWaveTriggerInterval = 8000;
    const maxSplashParticles = 20;
    const splashRadiusMin = 2;
    const splashRadiusMax = 8;
    const splashSpeedMax = 2;
    const splashDuration = 500;
    const showMessageBox = useCallback((title, content, buttonText = 'ठीक है') => {
        setMessageBoxVisible(true);
        setMessageTitle(title);
        setMessageContent(content);
    }, []);
    const hideMessageBox = useCallback(() => {
        setMessageBoxVisible(false);
    }, []);
    const resizeCanvases = useCallback(() => {
        const waterCanvas = waterCanvasRef.current;
        const rainCanvas = rainCanvasRef.current;
        const cloudCanvas = cloudCanvasRef.current;
        const lightningCanvas = lightningCanvasRef.current;
        const container = waterCanvas?.parentElement;
        if (waterCanvas && rainCanvas && cloudCanvas && lightningCanvas && container) {
            waterCanvas.width = container.clientWidth;
            waterCanvas.height = container.clientHeight / 2;
            rainCanvas.width = container.clientWidth;
            rainCanvas.height = container.clientHeight;
            cloudCanvas.width = container.clientWidth;
            cloudCanvas.height = container.clientHeight / 2;
            lightningCanvas.width = container.clientWidth;
            lightningCanvas.height = container.clientHeight;
        }
    }, []);
    const createRainParticle = useCallback(() => {
        const rainCanvas = rainCanvasRef.current;
        if (!rainCanvas) return null;
        return {
            x: Math.random() * rainCanvas.width,
            y: -(Math.random() * rainCanvas.height),
            length: Math.random() * (rainLengthMax - rainLengthMin) + rainLengthMin,
            speed: Math.random() * (rainSpeedMax - rainSpeedMin) + rainSpeedMin
        };
    }, []);
    const updateRainParticles = useCallback(() => {
        const currentRainParticles = rainParticles.current;
        const rainCanvas = rainCanvasRef.current;
        if (!rainCanvas) return;
        for (let i = 0; i < currentRainParticles.length; i++) {
            const p = currentRainParticles[i];
            p.y += p.speed;
            if (p.y > rainCanvas.height) {
                currentRainParticles[i] = createRainParticle();
            }
        }
    }, [createRainParticle]);
    const drawRainParticles = useCallback(() => {
        const rainCanvas = rainCanvasRef.current;
        const ctxRain = rainCanvas?.getContext('2d');
        const currentRainParticles = rainParticles.current;
        if (!ctxRain || !rainCanvas) return;
        ctxRain.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
        ctxRain.strokeStyle = rainColor;
        ctxRain.lineWidth = 1;
        for (let i = 0; i < currentRainParticles.length; i++) {
            const p = currentRainParticles[i];
            ctxRain.beginPath();
            ctxRain.moveTo(p.x, p.y);
            ctxRain.lineTo(p.x, p.y + p.length);
            ctxRain.stroke();
        }
    }, []);
    const createCloudParticle = useCallback(() => {
        const cloudCanvas = cloudCanvasRef.current;
        if (!cloudCanvas) return null;
        return {
            x: Math.random() * cloudCanvas.width,
            y: Math.random() * cloudCanvas.height * 0.5,
            size: Math.random() * 30 + 40,
            speed: Math.random() * (cloudSpeedMax - cloudSpeedMin) + cloudSpeedMin
        };
    }, []);
    const updateCloudParticles = useCallback(() => {
        const currentCloudParticles = cloudParticles.current;
        const cloudCanvas = cloudCanvasRef.current;
        if (!cloudCanvas) return;
        for (let i = 0; i < currentCloudParticles.length; i++) {
            const p = currentCloudParticles[i];
            p.x += p.speed + currentTiltY.current * 0.05;
            if (p.x > cloudCanvas.width + p.size * 2) {
                p.x = -p.size * 2;
                p.y = Math.random() * cloudCanvas.height * 0.5;
            } else if (p.x < -p.size * 2) {
                p.x = cloudCanvas.width + p.size * 2;
                p.y = Math.random() * cloudCanvas.height * 0.5;
            }
        }
    }, []);
    const drawCloudParticles = useCallback(() => {
        const cloudCanvas = cloudCanvasRef.current;
        const ctxCloud = cloudCanvas?.getContext('2d');
        const currentCloudParticles = cloudParticles.current;
        if (!ctxCloud || !cloudCanvas) return;
        ctxCloud.clearRect(0, 0, cloudCanvas.width, cloudCanvas.height);
        ctxCloud.fillStyle = cloudColor;
        for (let i = 0; i < currentCloudParticles.length; i++) {
            const p = currentCloudParticles[i];
            ctxCloud.beginPath();
            ctxCloud.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
            ctxCloud.arc(p.x + p.size * 0.5, p.y + p.size * 0.2, p.size * 0.7, 0, Math.PI * 2);
            ctxCloud.arc(p.x - p.size * 0.4, p.y + p.size * 0.1, p.size * 0.5, 0, Math.PI * 2);
            ctxCloud.closePath();
            ctxCloud.fill();
        }
    }, []);
    const drawLightningBolt = useCallback((startX, startY, endY) => {
        const lightningCanvas = lightningCanvasRef.current;
        const ctxLightning = lightningCanvas?.getContext('2d');
        if (!ctxLightning || !lightningCanvas) return;
        ctxLightning.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height);
        ctxLightning.strokeStyle = lightningColor;
        ctxLightning.lineWidth = lightningThickness;
        ctxLightning.lineCap = 'round';
        ctxLightning.lineJoin = 'round';
        ctxLightning.shadowColor = lightningColor;
        ctxLightning.shadowBlur = 15;
        ctxLightning.beginPath();
        ctxLightning.moveTo(startX, startY);
        let currentX = startX;
        let currentY = startY;
        for (let i = 0; i < lightningMaxSegments; i++) {
            currentY += lightningSegmentLength;
            currentX += (Math.random() - 0.5) * lightningOffset * 2;
            currentX = Math.max(0, Math.min(lightningCanvas.width, currentX));
            if (currentY > endY) {
                currentY = endY;
                break;
            }
            ctxLightning.lineTo(currentX, currentY);
        }
        ctxLightning.stroke();
        ctxLightning.shadowBlur = 0;
    }, []);
    const triggerLightning = useCallback(() => {
        const lightningCanvas = lightningCanvasRef.current;
        if (!lightningCanvas) return;
        if (Math.random() < 0.005) {
            lightningVisible.current = true;
            setIsFlashing(true);
            const startX = Math.random() * lightningCanvas.width;
            const startY = 0;
            const endY = lightningCanvas.height * 0.7;
            drawLightningBolt(startX, startY, endY);
            setTimeout(() => {
                lightningVisible.current = false;
                lightningCanvas.getContext('2d')?.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height);
                setIsFlashing(false);
            }, 150);
        }
    }, [drawLightningBolt]);
    const createSplashParticle = useCallback((x, y) => {
        return {
            x: x,
            y: y,
            radius: Math.random() * (splashRadiusMax - splashRadiusMin) + splashRadiusMin,
            speedX: (Math.random() - 0.5) * splashSpeedMax * 2,
            speedY: (Math.random() - 1) * splashSpeedMax * 2,
            alpha: 1,
            life: splashDuration
        };
    }, []);
    const updateSplashParticles = useCallback(() => {
        const currentSplashParticles = splashParticles.current;
        for (let i = currentSplashParticles.length - 1; i >= 0; i--) {
            const p = currentSplashParticles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.alpha -= 1 / p.life;
            p.radius *= 0.98;
            if (p.alpha <= 0.1 || p.radius <= 0.5) {
                currentSplashParticles.splice(i, 1);
            }
        }
    }, []);
    const drawSplashParticles = useCallback(() => {
        const waterCanvas = waterCanvasRef.current;
        const ctxWater = waterCanvas?.getContext('2d');
        const currentSplashParticles = splashParticles.current;
        if (!ctxWater || !waterCanvas) return;
        for (let i = 0; i < currentSplashParticles.length; i++) {
            const p = currentSplashParticles[i];
            ctxWater.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctxWater.beginPath();
            ctxWater.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctxWater.fill();
        }
    }, []);
    const drawWaves = useCallback(() => {
        const waterCanvas = waterCanvasRef.current;
        const ctxWater = waterCanvas?.getContext('2d');
        if (!ctxWater || !waterCanvas) return;
        ctxWater.clearRect(0, 0, waterCanvas.width, waterCanvas.height);
        const gradient = ctxWater.createLinearGradient(0, 0, 0, waterCanvas.height);
        gradient.addColorStop(0, '#63b3ed');
        gradient.addColorStop(1, '#4299e1');
        ctxWater.fillStyle = gradient;
        ctxWater.beginPath();
        ctxWater.moveTo(0, waterCanvas.height);
        const adjustedWaveAmplitude = waveAmplitudeBase + (Math.abs(currentTiltX.current) + Math.abs(currentTiltY.current)) * 0.2;
        const adjustedWaveSpeed = waveSpeedBase + (Math.abs(currentTiltX.current) + Math.abs(currentTiltY.current)) * 0.002;
        for (let x = 0; x <= waterCanvas.width; x += 1) {
            let y = waterCanvas.height / 2 +
                adjustedWaveAmplitude * Math.sin(x * waveFrequency + wavePhase.current) +
                currentTiltX.current * 0.5;
            if (largeWaveActive.current) {
                const waveX = x - (waterCanvas.width - largeWaveCurrentPhase.current);
                y += largeWaveAmplitude * Math.sin(waveX * largeWaveFrequency);
                const logoAreaXStart = waterCanvas.width * 0.2;
                const logoAreaXEnd = waterCanvas.width * 0.8;
                const waveFrontX = waterCanvas.width - largeWaveCurrentPhase.current;
                const waveImpactZone = (Math.PI / largeWaveFrequency) * 0.5;
                if (waveFrontX > logoAreaXStart && waveFrontX < logoAreaXEnd + waveImpactZone && splashParticles.current.length === 0) {
                    for (let i = 0; i < maxSplashParticles; i++) {
                        splashParticles.current.push(createSplashParticle(
                            logoAreaXStart + (Math.random() * (logoAreaXEnd - logoAreaXStart)),
                            waterCanvas.height / 2 + (Math.random() - 0.5) * 20
                        ));
                    }
                }
            }
            ctxWater.lineTo(x, y);
        }
        ctxWater.lineTo(waterCanvas.width, waterCanvas.height);
        ctxWater.closePath();
        ctxWater.fill();
        wavePhase.current += adjustedWaveSpeed;
        if (largeWaveActive.current) {
            largeWaveCurrentPhase.current += largeWaveSpeed * 5;
        }
        const rotationYRad = currentTiltY.current * Math.PI / 180;
        ctxWater.save();
        ctxWater.translate(waterCanvas.width / 2, waterCanvas.height);
        ctxWater.rotate(rotationYRad * 0.5);
        ctxWater.translate(-waterCanvas.width / 2, -waterCanvas.height);
        ctxWater.restore();
    }, [waveAmplitudeBase, waveFrequency, waveSpeedBase, currentTiltX, currentTiltY, largeWaveAmplitude, largeWaveFrequency, largeWaveSpeed, createSplashParticle]);
    const animate = useCallback(() => {
        drawWaves();
        updateRainParticles();
        drawRainParticles();
        updateCloudParticles();
        drawCloudParticles();
        triggerLightning();
        updateSplashParticles();
        drawSplashParticles();
        animationFrameId.current = requestAnimationFrame(animate);
    }, [drawWaves, updateRainParticles, drawRainParticles, updateCloudParticles, drawCloudParticles, triggerLightning, updateSplashParticles, drawSplashParticles]);
    const handleOrientation = useCallback((event) => {
        const gamma = event.gamma;
        const beta = event.beta;
        const maxTilt = 30;
        currentTiltX.current = Math.max(-maxTilt, Math.min(maxTilt, beta));
        currentTiltY.current = Math.max(-maxTilt, Math.min(maxTilt, gamma));
    }, []);
    const handlePermissionClick = useCallback(() => {
        const permissionButtonContainer = document.getElementById('ww-permissionButtonContainer');
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                        showMessageBox('अनुमति मिली', 'अब आप डिवाइस को झुकाकर पानी को हिला सकते हैं, बारिश, बादल और बिजली देख सकते हैं!');
                        if (permissionButtonContainer) {
                            permissionButtonContainer.style.display = 'none';
                        }
                    } else {
                        showMessageBox('अनुमति अस्वीकृत', 'पानी, बारिश, बादल और बिजली देखने के लिए डिवाइस मोशन अनुमति की आवश्यकता है।');
                    }
                })
                .catch(error => {
                    console.error('डिवाइस मोशन अनुमति का अनुरोध करते समय त्रुटि:', error);
                    showMessageBox('त्रुटि', 'डिवाइस मोशन अनुमति का अनुरोध करते समय एक त्रुटि हुई।');
                });
        }
    }, [showMessageBox, handleOrientation]);
    useEffect(() => {
        resizeCanvases();
        window.addEventListener('resize', resizeCanvases);
        for (let i = 0; i < maxRainParticles; i++) {
            rainParticles.current.push(createRainParticle());
        }
        for (let i = 0; i < maxCloudParticles; i++) {
            cloudParticles.current.push(createCloudParticle());
        }
        const largeWaveInterval = setInterval(() => {
            largeWaveActive.current = true;
            largeWaveCurrentPhase.current = 0;
            setTimeout(() => {
                largeWaveActive.current = false;
            }, largeWaveDuration);
        }, largeWaveTriggerInterval);
        const permissionButton = document.getElementById('ww-permissionButton');
        const permissionButtonContainer = document.getElementById('ww-permissionButtonContainer');
        if (!window.DeviceOrientationEvent) {
            showMessageBox(
                'असमर्थित डिवाइस',
                'आपका ब्राउज़र या डिवाइस डिवाइस ओरिएंटेशन सेंसर का समर्थन नहीं करता है। पानी नहीं हिलेगा, बारिश, बादल और बिजली नहीं दिखेंगे।',
                'ठीक है'
            );
        } else if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            if (permissionButtonContainer && permissionButton) {
                permissionButtonContainer.style.display = 'block';
                permissionButton.textContent = 'पानी हिलाने की अनुमति दें';
                permissionButton.addEventListener('click', handlePermissionClick);
            }
            showMessageBox(
                'अनुमति आवश्यक है',
                'पानी को हिलाने, बारिश, बादल और बिजली देखने के लिए आपको डिवाइस मोशन अनुमति देनी होगी। कृपया नीचे दिए गए बटन पर क्लिक करें। (यह HTTPS कनेक्शन पर बेहतर काम करता है)',
                'ठीक है'
            );
        } else {
            window.addEventListener('deviceorientation', handleOrientation);
        }
        animate();
        return () => {
            window.removeEventListener('resize', resizeCanvases);
            window.removeEventListener('deviceorientation', handleOrientation);
            if (permissionButton) {
                permissionButton.removeEventListener('click', handlePermissionClick);
            }
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            clearInterval(largeWaveInterval);
        };
    }, [resizeCanvases, createRainParticle, createCloudParticle, animate, showMessageBox, handleOrientation, createSplashParticle, handlePermissionClick]);


    return (
        <>
            <div className={`ww-container ${isFlashing ? 'ww-dim' : ''}`}>
                <canvas ref={waterCanvasRef} id="ww-waterCanvas"></canvas>
                <canvas ref={cloudCanvasRef} id="ww-cloudCanvas"></canvas>
                <canvas ref={rainCanvasRef} id="ww-rainCanvas"></canvas>
                <canvas ref={lightningCanvasRef} id="ww-lightningCanvas"></canvas>
                
                <div className="ww-brand-logos" id="ww-brandLogos">
                    {/* --- BADLAV YAHAN --- */}
                    <img 
                        src="./arsha-ai.png" // Ptron ki jagah Arsha ka icon
                        alt="Arsha AI"      // Alt text badla gaya
                        onClick={() => {    // Click handler badla gaya
                            if (navigate) {
                                navigate('/ai-chat'); // AI Chat page par navigate karein
                            } else {
                                console.error("Error: navigate function is not available.");
                            }
                        }}
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x50/cccccc/000000?text=ARSHA"; }}
                    />
                   {/* --- BADLAV YAHAN KHATAM --- */}

                    <img 
                        src="./gleam&glame_logo.png"
                        alt="Gleam Glame Logo" 
                        onClick={scrollToKitSection}
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x50/0000FF/FFFFFF?text=GLEAM+GLAME"; }}
                    />
                </div>
            </div>

            {messageBoxVisible && (
                <div id="ww-messageBox" className="ww-message-box" style={{ display: 'flex' }}>
                    <h3 id="ww-messageTitle">{messageTitle}</h3>
                    <p id="ww-messageContent">{messageContent}</p>
                    <button id="ww-messageButton" onClick={hideMessageBox}>
                        ठीक है
                    </button>
                </div>
            )}

            <div id="ww-permissionButtonContainer">
                <button id="ww-permissionButton"></button>
            </div>
        </>
    );
};

export default BrandSection;