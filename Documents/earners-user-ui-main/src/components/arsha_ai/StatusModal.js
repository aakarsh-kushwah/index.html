// StatusModal.js

import React, { useEffect, useRef } from 'react';
import './StatusModal.css';

const StatusModal = ({ isProfileOpen, statuses, currentStatusIndex, onClose, onNext, onPrevious }) => {
    const timerRef = useRef(null);

    // यह इफ़ेक्ट स्टेटस को ऑटोमैटिकली आगे बढ़ाता है
    useEffect(() => {
        // कंपोनेंट री-रेंडर होने पर किसी भी मौजूदा टाइमर को क्लियर करें
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (isProfileOpen) {
            // मौजूदा स्टेटस की ड्यूरेशन के लिए एक नया टाइमर सेट करें
            timerRef.current = setTimeout(() => {
                onNext();
            }, statuses[currentStatusIndex].duration);
        }

        // कंपोनेंट अनमाउंट होने पर टाइमर को क्लियर करने के लिए क्लीनअप फ़ंक्शन
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [currentStatusIndex, isProfileOpen, onNext, statuses]);

    if (!isProfileOpen) {
        return null;
    }

    const currentStatus = statuses[currentStatusIndex];

    return (
        <div className="status-modal-overlay" onMouseDown={onClose}>
            <div className="status-modal-content" onMouseDown={(e) => e.stopPropagation()}>
                {/* सबसे ऊपर प्रोग्रेस बार */}
                <div className="status-progress-container">
                    {statuses.map((_, index) => (
                        <div key={index} className="progress-bar-background">
                            <div
                                className={`progress-bar-foreground ${index === currentStatusIndex ? 'active' : ''}`}
                                style={{
                                    width: index < currentStatusIndex ? '100%' : '0', // देखे हुए स्टेटस के लिए 100%
                                    animationDuration: index === currentStatusIndex ? `${currentStatus.duration / 1000}s` : 'none',
                                }}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* प्रोफाइल जानकारी के साथ हेडर */}
                <div className="status-header">
                    <img src="/arsha-ai.png" alt="Arsha" className="status-profile-pic" />
                    <div className="status-profile-info">
                        <span className="status-profile-name">Arsha</span>
                    </div>
                    <button className="status-close-button" onClick={onClose}>×</button>
                </div>

                {/* स्टेटस का असली कंटेंट (इमेज/वीडियो) */}
                <div className="status-media-container">
                    {currentStatus.type === 'image' && (
                        <img src={currentStatus.path} alt={`Status ${currentStatusIndex + 1}`} className="status-media" />
                    )}
                    {/* जरूरत पड़ने पर वीडियो सपोर्ट भी जोड़ सकते हैं */}
                </div>

                {/* नेविगेशन कंट्रोल्स */}
                <div className="status-nav-prev" onClick={onPrevious}></div>
                <div className="status-nav-next" onClick={onNext}></div>
            </div>
        </div>
    );
};

export default StatusModal;