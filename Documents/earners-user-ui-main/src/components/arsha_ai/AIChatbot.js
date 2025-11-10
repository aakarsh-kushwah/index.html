import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './AIChatbot.css';
import StatusModal from './StatusModal';
import './StatusModal.css';

// =================================================================================
// 1. Constants
// =================================================================================
const ARSHA_BASE = process.env.REACT_APP_ARSHA_BASE || 'http://localhost:5000';
const EW_BASE = process.env.REACT_APP_EW_BASE || 'http://127.0.0.1:8000';
const ARSHA_PROFILE_PIC = '/arsha-ai.png';
const STATUSES = [
    { type: 'image', path: '/arsha_product_status.png', duration: 5000 },
    { type: 'image', path: '/arsha_status.jpg', duration: 5000 },
    { type: 'image', path: '/arsha_cofee_status.jpg', duration: 5000 },
];

// =================================================================================
// 2. Utility Function
// =================================================================================
function getGuestId() {
    let guestId = localStorage.getItem('arshaGuestId');
    if (!guestId) {
        guestId = uuidv4();
        localStorage.setItem('arshaGuestId', guestId);
    }
    return guestId;
}

// =================================================================================
// 3. API Service
// =================================================================================
const apiService = {
    fetchChatHistory: async (token, guestId) => {
        const headers = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        } else {
            headers['x-guest-id'] = guestId;
        }
        const res = await fetch(`${ARSHA_BASE}/chat-history`, { headers });
        if (!res.ok) throw new Error('Failed to fetch history');
        return res.json();
    },
    fetchUserProfile: async (token) => {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await fetch(`${EW_BASE}/api/user/user-profile-details`, { headers });
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
    },
    postChatMessage: async (body) => {
        const res = await fetch(`${ARSHA_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Failed to send message');
        return res.json();
    }
};

// =================================================================================
// 4. Icon Components
// =================================================================================
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);
const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
);
const ReplyIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"></path>
    </svg>
);

// --- FIX --- (no-unused-vars)
// CloseIcon ko 'onClick' prop pass kiya taaki yeh use ho sake.
const CloseIcon = ({ onClick }) => (
    <button onClick={onClick} className="ew-reply-cancel-button">✖</button>
);

const TypingIndicator = memo(() => (
    <div className='ew-message-container'>
        <div className='ew-message-row ew-message-assistant'>
            <img src={ARSHA_PROFILE_PIC} alt='Arsha' className='ew-profile-pic-small' />
            <div className='ew-message-bubble ew-message-assistant-bubble ew-typing-indicator'>
                <span></span><span></span><span></span>
            </div>
        </div>
    </div>
));

// =================================================================================
// 5. Custom Hook (Speech recognition logic)
// =================================================================================
const useSpeechRecognition = ({ onResult, onEnd }) => {
    const recognitionRef = useRef(null);
    const [isListening, setIsListening] = useState(false);

    // --- FIX --- (exhaustive-deps & stale closure)
    // Callbacks ko ref mein store kiya taaki useEffect baar-baar run na ho.
    const onResultRef = useRef(onResult);
    const onEndRef = useRef(onEnd);
    useEffect(() => { onResultRef.current = onResult; }, [onResult]);
    useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);
    // --- END FIX ---

    useEffect(() => {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => setIsListening(true);
            
            // Ref se call karein
            recognition.onresult = (event) => onResultRef.current(event.results[0][0].transcript);
            
            recognition.onend = () => {
                setIsListening(false);
                onEndRef.current(); // Ref se call karein
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
            recognitionRef.current = recognition;
        } else {
            console.warn('Speech Recognition not supported.');
        }
    }, []); // <-- Dependency array ko KHAALI chhod diya hai.

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    return { isListening, startListening, stopListening };
};

// =================================================================================
// 6. Sub-Components (Memoized for performance)
// =================================================================================
const MessageContent = memo(({ content }) => {
    // ... (Code mein koi change nahi)
    const mediaRegex = /\[(IMAGE|VIDEO):\s*([^\]]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = mediaRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            parts.push(content.substring(lastIndex, match.index));
        }
        const [fullMatch, type, path] = match;
        const trimmedPath = path.trim();
        if (type === 'IMAGE') {
            parts.push(<img key={lastIndex} src={trimmedPath} alt="Product" className="ew-chat-media" />);
        } else if (type === 'VIDEO') {
            parts.push(<video key={lastIndex} src={trimmedPath} controls className="ew-chat-media" />);
        }
        lastIndex = match.index + fullMatch.length;
    }
    if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
    }
    return parts.length > 0 ? <>{parts.map((part, i) => <React.Fragment key={i}>{part}</React.Fragment>)}</> : <>{content}</>;
});

const ReplyingToDisplay = memo(({ message, onCancel }) => (
    <div className="ew-replying-to-container">
        <div className="ew-replying-to-content">
            <span className="ew-replying-to-header">{message.role === 'user' ? 'You' : 'Arsha'}</span>
            <p className="ew-replying-to-text">{message.content}</p>
        </div>
        {/* --- FIX --- (no-unused-vars) Hardcoded button ko CloseIcon component se badal diya */}
        <CloseIcon onClick={onCancel} />
    </div>
));

const ChatHeader = memo(({ userProfile, onClick, pic }) => (
    <div className='ew-profile-header-bar' onClick={onClick}>
        <img src={pic} alt='Arsha AI' className='ew-profile-pic' />
        <div className='ew-profile-info'>
            <h1 className='ew-profile-name'>
                {userProfile ? userProfile.first_name : 'Arsha'}
                <span className="ew-profile-tagline">Earnerswave Startup Hustler</span>
            </h1>
        </div>
    </div>
));

const Message = memo(({ msg, idx, onDragStart, dragState, onReply }) => (
    <div className="ew-message-container">
        <div
            className={`ew-message-row ew-message-${msg.role}`}
            onMouseDown={(e) => onDragStart(e, idx)}
            onTouchStart={(e) => onDragStart(e, idx)}
            style={{ transform: dragState.id === idx ? `translateX(${dragState.distance}px)` : 'translateX(0px)' }}
        >
            {msg.role === 'assistant' && (
                <img src={ARSHA_PROFILE_PIC} alt='Arsha' className='ew-profile-pic-small' />
            )}
            <div className={`ew-message-bubble ew-message-${msg.role}-bubble`}>
                <MessageContent content={msg.content} />
                <div className="ew-message-meta">
                    <span className='ew-message-timestamp'>{msg.timestamp}</span>
                    {msg.role === 'user' && <span className="ew-delivery-ticks"></span>}
                </div>
            </div>
        </div>
        <button className="ew-reply-button" onClick={() => onReply(msg)}>
            <ReplyIcon />
        </button>
        <div
            className="ew-reply-icon-drag"
            style={{ opacity: Math.min(dragState.id === idx ? dragState.distance / 50 : 0, 1) }}
        >
            <ReplyIcon />
        </div>
    </div>
));

const ChatInput = memo(({
    input, replyingTo, isLoading, isListening,
    onInputChange, onKeyDown, onSend, onMicClick, onMicUp, onCancelReply
}) => {
    // --- FIX --- (no-undef)
    // inputRef ko child component (ChatInput) mein define kiya gaya.
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    }, [input]);
    
    // Focus input when replying
    useEffect(() => {
        if (replyingTo) {
            inputRef.current?.focus();
        }
    }, [replyingTo]);

    const isInputEmpty = input.trim() === '';

    return (
        <div className='ew-chat-input-container'>
            {replyingTo && <ReplyingToDisplay message={replyingTo} onCancel={onCancelReply} />}
            <div className="ew-chat-input-row">
                <div className="ew-chat-input-main">
                    <textarea
                        ref={inputRef} // Ref yahaan use ho raha hai
                        value={input}
                        onChange={onInputChange}
                        onKeyDown={onKeyDown}
                        placeholder="Message"
                        rows="1"
                    />
                </div>
                <button
                    onClick={isInputEmpty ? onMicClick : onSend}
                    onMouseUp={onMicUp}
                    disabled={isLoading}
                    className={`ew-send-mic-button ${isListening ? 'ew-listening' : ''}`}
                >
                    {isInputEmpty ? <MicIcon /> : <SendIcon />}
                </button>
            </div>
        </div>
    );
});


// =================================================================================
// 7. Main Chatbot Component
// =================================================================================
const AIChatbot = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [dragState, setDragState] = useState({ id: null, distance: 0, isDragging: false });
    const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

    const chatBoxRef = useRef(null);
    const dragStartPos = useRef(null);

    // --- Drag-to-Reply Logic ---
    const getClientX = (e) => e.touches ? e.touches[0].clientX : e.clientX;

    // --- FIX --- (exhaustive-deps)
    // handleDragMove aur handleDragEnd ko dependency array mein add kiya.
    const handleDragMove = useCallback((e) => {
        if (dragStartPos.current === null) return;
        const currentX = getClientX(e);
        let distance = currentX - dragStartPos.current;
        if (distance < 0) distance = 0;
        if (distance > 70) distance = 70; // Cap drag distance
        setDragState(prev => ({ ...prev, distance, isDragging: true }));
    }, []); // Iski dependency array khaali hai, yeh theek hai.

    const handleReply = useCallback((messageToReply) => {
        setReplyingTo(messageToReply);
        if (window.navigator.vibrate) { window.navigator.vibrate(20); }
    }, []);
    
    const handleDragEnd = useCallback(() => {
        setDragState(prev => {
            if (prev.id !== null && prev.isDragging && prev.distance > 50) {
                handleReply(messages[prev.id]);
            }
            return { id: null, distance: 0, isDragging: false };
        });
        dragStartPos.current = null;
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchend', handleDragEnd);
    }, [messages, handleReply, handleDragMove]); // handleDragMove stable hai

    const handleDragStart = useCallback((e, index) => {
        dragStartPos.current = getClientX(e);
        setDragState({ id: index, distance: 0, isDragging: true });
        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('touchmove', handleDragMove);
        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchend', handleDragEnd);
    }, [handleDragMove, handleDragEnd]); // <-- Dependencies add kar di hain.
    // --- END FIX ---

    // --- Send Message Logic ---
    const sendMessage = useCallback(async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput || isLoading) return;

        const token = localStorage.getItem('token');
        const guestId = getGuestId();
        const userMessage = { 
            role: 'user', 
            content: trimmedInput, 
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
        };
        
        const updatedMessages = [...messages, userMessage];
        const repliedMessage = replyingTo ? { role: replyingTo.role, content: replyingTo.content } : null;

        setMessages(updatedMessages);
        setInput('');
        setReplyingTo(null);
        setIsLoading(true);

        try {
            const data = await apiService.postChatMessage({
                message: updatedMessages.map(({ role, content }) => ({ role, content })),
                token,
                isRegistered: !!token,
                replyTo: repliedMessage,
                guestId: token ? null : guestId
            });
            
            const botMessage = { 
                role: 'assistant', 
                content: data.reply || 'No response.', 
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
            };
            if (data?.user) setUserProfile(data.user);
            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            console.error('Arsha API Error:', err);
            const errorMessage = { 
                role: 'assistant', 
                content: 'Sorry, thoda issue aa gaya. Please try again later.', 
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages, replyingTo]);

    // --- Speech Recognition Logic ---
    const handleSpeechResult = useCallback((transcript) => {
        setInput(transcript);
    }, []);

    // --- FIX --- (no-undef: inputRef)
    // 'inputRef' ko access karne ki koshish hata di.
    // 'sendMessage' function khud 'input' state ko check karta hai.
    const handleSpeechEnd = useCallback(() => {
        // sendMessage function (jo useCallback se bana hai) 
        // 'input' state ka latest version access karega.
        sendMessage();
    }, [sendMessage]); // Ab yeh sirf sendMessage par depend karta hai.
    // --- END FIX ---

    const { isListening, startListening, stopListening } = useSpeechRecognition({
        onResult: handleSpeechResult,
        onEnd: handleSpeechEnd
    });

    // --- Effects ---
    // Initial Load (History & Profile)
    useEffect(() => {
        async function init() {
            const token = localStorage.getItem('token');
            const guestId = getGuestId();
            let initialHistory = [];
            let greeting = "Hey there! I'm Arsha, co-founder of EarnersWave. I'm here to help you. What's your name? 😊";

            try {
                const historyData = await apiService.fetchChatHistory(token, guestId);
                initialHistory = historyData.history || [];

                if (token) {
                    const profileData = await apiService.fetchUserProfile(token);
                    if (profileData?.status && profileData?.data) {
                        setUserProfile(profileData.data);
                        const name = profileData.data.first_name || 'User';
                        greeting = `Welcome back, ${name}! Great to see you. What's our next big goal today? Let's make it happen. 💪`;
                    }
                }
            } catch (e) {
                console.warn('Initialization failed.', e);
            }

            if (initialHistory.length > 0) {
                setMessages(initialHistory);
            } else {
                setMessages([{
                    role: 'assistant',
                    content: greeting,
                    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                }]);
            }
        }
        init();
    }, []); // Run only once on mount

    // Scroll to bottom
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    // Handle browser back button for modal
    useEffect(() => {
        const handleBack = (e) => {
            if (isProfileOpen) {
                e.preventDefault();
                setIsProfileOpen(false);
                window.history.replaceState({}, ''); // Clean up history state
            }
        };
        window.addEventListener('popstate', handleBack);
        return () => window.removeEventListener('popstate', handleBack);
    }, [isProfileOpen]);

    // --- Event Handlers ---
    const handleInput = useCallback((e) => {
        setInput(e.target.value);
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }, [sendMessage]);

    const handleOpenProfile = useCallback(() => {
        setIsProfileOpen(true);
        setCurrentStatusIndex(0);
        window.history.pushState({}, ''); // Add history state for modal
    }, []);

    const handleNextStatus = () => {
        if (currentStatusIndex < STATUSES.length - 1) {
            setCurrentStatusIndex(currentStatusIndex + 1);
        } else {
            setIsProfileOpen(false); // Close after last status
            setCurrentStatusIndex(0);
        }
    };
    const handlePreviousStatus = () => {
        if (currentStatusIndex > 0) {
            setCurrentStatusIndex(currentStatusIndex - 1);
        }
    };
    
    // --- Render ---
    return (
        <div className='ew-chatbot-container'>
            <ChatHeader
                userProfile={userProfile}
                onClick={handleOpenProfile}
                pic={ARSHA_PROFILE_PIC}
            />
            <StatusModal
                isProfileOpen={isProfileOpen}
                statuses={STATUSES}
                currentStatusIndex={currentStatusIndex}
                onClose={() => setIsProfileOpen(false)}
                onNext={handleNextStatus}
                onPrevious={handlePreviousStatus}
            />

            <div className='ew-chat-section'>
                <div className='ew-chat-box' ref={chatBoxRef}>
                    {messages.map((msg, idx) => (
                        <Message
                            key={idx}
                            msg={msg}
                            idx={idx}
                            onDragStart={handleDragStart}
                            dragState={dragState}
                            onReply={handleReply}
                        />
                    ))}
                    {isLoading && <TypingIndicator />}
                </div>

                <ChatInput
                    input={input}
                    replyingTo={replyingTo}
                    isLoading={isLoading}
                    isListening={isListening}
                    onInputChange={handleInput}
                    onKeyDown={handleKeyDown}
                    onSend={sendMessage}
                    onMicClick={startListening}
                    onMicUp={stopListening} // `onEnd` handles send
                    onCancelReply={() => setReplyingTo(null)}
                />
            </div>
        </div>
    );
};

export default AIChatbot;