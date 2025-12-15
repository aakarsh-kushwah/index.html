import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Bot, Zap, Video, Star, TrendingUp, Camera, 
    LogOut, User, ChevronDown 
} from 'lucide-react';
import './UserDashboard.css'; 

// --- Logged Out Component ---
const LoggedOutMessage = () => (
    <div className="logged-out-container">
        <h2 className="logged-out-title">Logged Out</h2>
        <p className="logged-out-subtitle">Please log in again to access your dashboard.</p>
    </div>
);

function UserDashboard() {
    const navigate = useNavigate(); 
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    // User Data Initialization
    const [userData, setUserData] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('userData')) || {};
        } catch {
            return {};
        }
    });

    const dropdownRef = useRef(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.clear(); // Clears all auth tokens
        setIsLoggedOut(true);
        // Optional: navigate('/login') immediately if needed
    };

    // --- Reusable Card Component ---
    const DashboardCard = ({ title, description, icon, cta, onClick, cardId, isNew, variant = 'default' }) => {
        return (
            <div onClick={onClick} className={`dashboard-card-wrapper ${variant} ${cardId || ''}`}>
                <div className="dashboard-card-content">
                    <div className="dashboard-card-header">
                        <div className={`icon-container ${variant}`}>
                            {icon}
                        </div>
                        <div className="badge-container">
                            {variant === 'hero' && <span className="hero-badge">RECOMMENDED</span>}
                            {isNew && <span className="new-badge">NEW</span>}
                        </div>
                    </div>
                    <h3 className="dashboard-card-title">{title}</h3>
                    <p className="dashboard-card-description">{description}</p>
                    {cta && (
                        <div className="dashboard-card-footer">
                            <span className="dashboard-card-cta">{cta} &rarr;</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (isLoggedOut) return <LoggedOutMessage />;

    return (
        <div className="dashboard-layout">
            
            {/* --- Professional Header (No Sidebar) --- */}
            <header className="top-header">
                <div className="header-brand">
                    <img 
                        src="https://i.ibb.co/GrMTmd0/Gemini-Generated-Image-q98hyq98hyq98hyq-removebg-preview-removebg-preview.png" 
                        alt="RCM AI Logo" 
                        className="brand-logo"
                    />
                    <div className="brand-text">
                        <h1 className="brand-title">RCM AI Hub</h1>
                        <span className="brand-subtitle">Enterprise Edition</span>
                    </div>
                </div>

                {/* Profile Section (Replaces Sidebar) */}
                <div className="header-profile" ref={dropdownRef}>
                    <button 
                        className={`profile-trigger ${isProfileOpen ? 'active' : ''}`}
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="avatar-circle">
                            {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="profile-name-short">{userData.fullName?.split(' ')[0] || 'User'}</span>
                        <ChevronDown className={`icon-xs chevron ${isProfileOpen ? 'rotate' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="profile-dropdown">
                            <div className="dropdown-header">
                                <p className="dd-name">{userData.fullName || 'RCM User'}</p>
                                <p className="dd-email">{userData.email || 'user@rcm.com'}</p>
                                <span className="dd-id">ID: {userData.rcmId || 'N/A'}</span>
                            </div>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item logout" onClick={handleLogout}>
                                <LogOut className="icon-small" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* --- Main Content Area --- */}
            <main className="dashboard-main-container">
                <div className="dashboard-welcome">
                    <h2 className="welcome-text">
                        Welcome back, <span className="gradient-text">{userData.fullName || 'Leader'}</span>
                    </h2>
                    <p className="welcome-sub">Select a tool to accelerate your business today.</p>
                </div>

                <div className="dashboard-grid">
                    
                    {/* 1. AI Assistant (Primary Tool) */}
                    <div className="card-column-span-2">
                         <div
                            className="ai-hero-card"
                            onClick={() => navigate('/chat')} 
                        >
                            <div className="ai-hero-content">
                                <div className="ai-hero-icon-box">
                                    <Bot className="icon-large-white" />
                                </div>
                                <div className="ai-hero-text">
                                    <h3>RCM AI Assistant</h3>
                                    <p>Your 24/7 intelligent partner. Ask about products, plans, or business strategies.</p>
                                </div>
                                <button className="ai-hero-btn">Launch AI &rarr;</button>
                            </div>
                        </div>
                    </div>

                    {/* 2. AI Live Meeting (New Feature) */}
                    <DashboardCard
                        cardId="ai-meeting-card"
                        title="AI Live Vision"
                        description="Start a video session. Show products to AI for instant analysis and coaching."
                        icon={<Camera className="icon-purple" />} 
                        cta="Start Camera"
                        isNew={true}
                        variant="hero" // Special styling
                        onClick={() => navigate('/ai-video-meeting')}
                    />

                    {/* 3. Daily PV Report */}
                    <DashboardCard
                        title="Daily PV Report"
                        description="Monitor your Personal Volume and consistency tracking."
                        icon={<TrendingUp className="icon-orange" />}
                        cta="View Analytics"
                        onClick={() => navigate('/daily-report')}
                    />

                    {/* 4. Leaders Videos */}
                    <DashboardCard
                        title="Leaders' Training"
                        description="Masterclasses from top RCM achievers."
                        icon={<Video className="icon-blue" />}
                        cta="Watch Now"
                        onClick={() => navigate('/leaders-videos')}
                    />

                    {/* 5. Products Videos */}
                    <DashboardCard
                        title="Product Academy"
                        description="Learn everything about our product range."
                        icon={<Star className="icon-green" />}
                        cta="Learn More"
                        onClick={() => navigate('/products-videos')}
                    />

                </div>
            </main>
        </div>
    );
}

export default UserDashboard;