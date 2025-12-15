import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Mic, MicOff, Video, VideoOff, X, 
    RefreshCw, Sparkles, ChevronDown, ScanLine,
    ShoppingBag, Tag, Info
} from 'lucide-react';
import './AIVideoMeeting.css';

const AIVideoMeeting = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // --- UI & Camera States ---
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    // 'environment' tries back camera first, falls back to front on laptops
    const [facingMode, setFacingMode] = useState('environment'); 
    
    // --- AI Workflow States ---
    // 'idle' | 'scanning' (laser effect) | 'analyzing' (spinner) | 'presenting' (showing result)
    const [aiState, setAiState] = useState('idle'); 
    const [transcript, setTranscript] = useState("RCM AI Vision Ready. Tap scan to identify.");
    const [detectedProduct, setDetectedProduct] = useState(null);

    // --- 1. Robust Camera Setup (Works on Laptop & Mobile) ---
    const startCamera = useCallback(async () => {
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        if (!isCameraOn) return;

        try {
            let stream;
            try {
                // Try high-res back camera first
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
                    audio: true
                });
            } catch (e) {
                console.warn("High-res cam failed, falling back.");
                // Fallback for laptops or older devices
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            }

            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Ensure video plays even if browser blocks autoplay
                await videoRef.current.play().catch(e => console.error("Play error:", e));
            }
        } catch (err) {
            console.error("Camera Error", err);
            setTranscript("Error: Camera access denied or unavailable.");
        }
    }, [facingMode, isCameraOn]);

    useEffect(() => {
        startCamera();
        return () => {
            if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        };
    }, [startCamera]);

    // --- 2. SIMULATION: The AI Scan Workflow ---
    // This simulates what will happen when Groq API + Your DB connect later.
    const handleScanTrigger = () => {
        if(aiState !== 'idle') return;

        // 1. Start Scanning Visuals
        setAiState('scanning');
        setTranscript("Acquiring target geometry...");
        setDetectedProduct(null); // Close previous sheet if open

        // Simulation: Wait 1.5s for "Scanning"
        setTimeout(() => {
            // 2. Start Analyzing Visuals (Simulating network call to Groq/DB)
            setAiState('analyzing');
            setTranscript("Analyzing with RCM Knowledge Base...");

            // Simulation: Wait 2s for "API Response"
            setTimeout(() => {
                // 3. Present Results (Simulating DB data return)
                simulateBackendResponse();
            }, 2000);

        }, 1500);
    };

    const simulateBackendResponse = () => {
        // MOCK DATA - This structure will come from your Admin Panel Database later
        const mockDBProducts = [
            {
                id: 101,
                name: "RCM Nutricharge Men",
                category: "Health Supplement",
                price: "₹375",
                pv: "275 PV",
                description: "A comprehensive daily nutritional supplement specifically formulated for men to fulfill their daily need of vitamins and minerals. Boosts energy and immunity."
            },
            {
                id: 102,
                name: "Good Dot Veg Bites",
                category: "Plant Protein",
                price: "₹190",
                pv: "110 PV",
                description: "Vegetarian meat alternative bite-sized chunks. High in protein, zero cholesterol. Ideal for curries, biryanis, and snacks."
            },
             {
                id: 103,
                name: "Health Guard Rice Bran Oil",
                category: "Cooking Essentials",
                price: "₹165 (1L)",
                pv: "80 PV",
                description: "Physically refined rice bran oil containing 1400mg Oryzanol. Known as 'Heart Oil' for its cholesterol-lowering properties."
            }
        ];
        
        const randomProduct = mockDBProducts[Math.floor(Math.random() * mockDBProducts.length)];
        
        setDetectedProduct(randomProduct);
        setAiState('presenting');
        setTranscript(`Identified: ${randomProduct.name}`);
    };


    // --- Utilities ---
    const toggleCam = () => setIsCameraOn(!isCameraOn);
    const toggleMic = () => setIsMicOn(!isMicOn);
    const switchCam = () => setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    const closeSheet = () => {
        setDetectedProduct(null);
        setAiState('idle');
    };


    return (
        <div className="gemini-pro-container">
            
            {/* === Top Status Bar === */}
            <div className="pro-top-bar">
                <button className="icon-glass" onClick={() => navigate('/dashboard')}>
                    <X size={24} />
                </button>
                <div className="live-status-badge">
                    <Sparkles size={14} className="sparkle-anim" />
                    <span>RCM Live Vision</span>
                </div>
                <div style={{width: 40}}></div> {/* Spacer for balance */}
            </div>

            {/* === Main Video Feed Area === */}
            <div className="video-stage">
                <video 
                    ref={videoRef} 
                    playsInline 
                    muted 
                    className={`main-video-feed ${facingMode === 'user' ? 'mirrored' : ''} ${!isCameraOn ? 'hidden' : ''}`} 
                />
                
                {!isCameraOn && (
                    <div className="video-placeholder-state">
                        <div className="placeholder-icon"><VideoOff size={40}/></div>
                        <p>Camera Paused</p>
                    </div>
                )}

                {/* Scanning Overlay Layer */}
                {aiState === 'scanning' && (
                    <div className="scan-overlay-layer">
                        <div className="laser-scanner-bar"></div>
                        <div className="scan-grid-pattern"></div>
                    </div>
                )}
            </div>

            {/* === The "Bottom Sheet" Product Result Panel === */}
            {/* Slides up from bottom like Google Maps/Gemini */}
            <div className={`pro-bottom-sheet ${aiState === 'presenting' && detectedProduct ? 'active' : ''}`}>
                <div className="sheet-grab-handle"></div>
                
                {detectedProduct && (
                    <div className="sheet-content-wrapper">
                        <div className="sheet-header-row">
                            <div className="sheet-title-block">
                                <span className="category-tag">{detectedProduct.category}</span>
                                <h2>{detectedProduct.name}</h2>
                            </div>
                             <button className="close-sheet-btn" onClick={closeSheet}>
                                <ChevronDown size={24} />
                            </button>
                        </div>

                        <div className="sheet-stats-row">
                            <div className="stat-chip price">
                                <Tag size={16} />
                                <span>{detectedProduct.price}</span>
                            </div>
                            <div className="stat-chip pv">
                                <ShoppingBag size={16} />
                                <span>{detectedProduct.pv}</span>
                            </div>
                        </div>

                        <div className="sheet-description-block">
                            <Info size={18} className="info-icon" />
                             <p>{detectedProduct.description}</p>
                        </div>
                         
                         <div className="sheet-actions">
                             <button className="sheet-btn primary">View Full Details</button>
                         </div>
                    </div>
                )}
            </div>

            {/* === Floating Controls Layer === */}
            <div className="floating-controls-layer">
                
                {/* 1. Floating Transcript Bubble */}
                {aiState !== 'idle' && aiState !== 'presenting' && (
                    <div className="floating-transcript-bubble">
                        {aiState === 'analyzing' ? (
                            <div className="thinking-dots"><span></span><span></span><span></span></div>
                        ) : (
                            <p>{transcript}</p>
                        )}
                    </div>
                )}

                {/* 2. The Main Control "Pill" Bar */}
                <div className="control-pill-bar">
                    <button className="ctrl-icon-btn" onClick={toggleCam}>
                        {isCameraOn ? <Video size={20} /> : <VideoOff size={20} color="#ef4444"/>}
                    </button>
                    
                    <button className="ctrl-icon-btn" onClick={switchCam}>
                        <RefreshCw size={20} />
                    </button>

                    {/* THE HERO BUTTON - Changes based on state */}
                    <button 
                        className={`hero-trigger-btn ${aiState}`} 
                        onClick={handleScanTrigger}
                        disabled={aiState === 'scanning' || aiState === 'analyzing'}
                    >
                        <div className="hero-btn-content">
                            {aiState === 'scanning' ? (
                                <ScanLine size={28} className="pulsing" />
                            ) : aiState === 'analyzing' ? (
                                <div className="spinner-ring"></div>
                            ) : (
                                <Sparkles size={28} fill="currentColor" />
                            )}
                        </div>
                    </button>

                    <button className="ctrl-icon-btn" onClick={toggleMic}>
                        {isMicOn ? <Mic size={20} /> : <MicOff size={20} color="#ef4444"/>}
                    </button>

                    <button className="ctrl-icon-btn exit-btn" onClick={() => navigate('/dashboard')}>
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIVideoMeeting;