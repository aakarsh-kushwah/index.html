import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, Video, MoreVertical, PhoneOff, Sparkles, User } from 'lucide-react';
import './AIVideoMeeting.css';

const AIVideoMeeting = () => {
    const videoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [transcript, setTranscript] = useState("AI is ready...");
    const [voices, setVoices] = useState([]);

    // 1. Load Voices (Microsoft Edge Priority)
    useEffect(() => {
        const loadVoices = () => {
            const availVoices = window.speechSynthesis.getVoices();
            setVoices(availVoices);
        };
        
        loadVoices();
        // Chrome/Edge load voices asynchronously
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    // 2. Camera Logic (Laptop Friendly)
    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            // Laptop ke liye simple constraints
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, // Auto-detect webcam
                audio: false 
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                    setIsCameraOn(true);
                };
            }
        } catch (err) {
            console.error("Camera Error:", err);
            setTranscript("Camera blocked! Check permissions.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    // 3. Scan & Speak Logic
    const handleScan = async () => {
        if (!videoRef.current || scanning) return;
        setScanning(true);
        setTranscript("AI देख रहा है...");

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('image', blob);

            try {
                const res = await fetch('http://localhost:8080/api/analyze', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                
                if (data.success) {
                    setTranscript(data.name);
                    speak(data.speak);
                } else {
                    setTranscript("दुबारा कोशिश करें।");
                }
            } catch (err) {
                console.error(err);
                setTranscript("Connection Error.");
            } finally {
                setScanning(false);
            }
        }, 'image/jpeg', 0.8);
    };

    // 4. Microsoft Voice Selector
    const speak = (text) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Priority: Microsoft Hindi -> Google Hindi -> Any Hindi
        const targetVoice = voices.find(v => v.name.includes("Microsoft") && v.name.includes("Hindi")) || 
                          voices.find(v => v.name.includes("Microsoft") && v.name.includes("India")) ||
                          voices.find(v => v.lang.includes("hi"));

        if (targetVoice) {
            utterance.voice = targetVoice;
            // Rate 1.0 is normal, Microsoft voices sound good at 1.0 or 0.9
            utterance.rate = 1.0; 
        }

        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="meeting-screen">
            <div className="video-container">
                {/* User Video */}
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="camera-view" 
                />
                
                {!isCameraOn && (
                    <div className="camera-placeholder">
                        <User size={64} color="#555" />
                        <p>Starting Camera...</p>
                    </div>
                )}

                {/* Overlays */}
                <div className="ai-badge">
                    <Sparkles size={16} /> Microsoft AI
                </div>

                <div className="captions-box">
                    <p>{transcript}</p>
                </div>

                {scanning && <div className="scan-laser"></div>}
            </div>

            <div className="bottom-dock">
                <button className="icon-btn"><Mic size={24} /></button>
                <button className="icon-btn" onClick={isCameraOn ? stopCamera : startCamera}>
                    <Video size={24} />
                </button>
                
                <button className={`scan-btn-main ${scanning ? 'pulse' : ''}`} onClick={handleScan}>
                    <Camera size={32} />
                </button>

                <button className="icon-btn"><MoreVertical size={24} /></button>
                <button className="icon-btn red"><PhoneOff size={24} /></button>
            </div>
        </div>
    );
};

export default AIVideoMeeting;