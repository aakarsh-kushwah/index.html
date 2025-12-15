import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Global UI Components ---
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

// --- Security Middleware ---
import UserProtectedRoute from './components/UserProtectedRoute'; 

/**
 * 🚀 Lazy Loading Strategy (Code Splitting)
 * This ensures faster initial load times by loading chunks only when needed.
 */

// 1. Public Pages (Authentication & Landing)
const LandingPage = lazy(() => import('./components/LandingPage'));
const LoginPage = lazy(() => import('./components/login/LoginPage'));
const RegisterPage = lazy(() => import('./components/RegisterPage/RegisterPage'));
const PaymentPage = lazy(() => import('./components/PaymentPage/PaymentPage'));

// 2. Core Dashboard & Utilities
const UserDashboard = lazy(() => import('./components/UserDashboard/UserDashboard'));
const DailyReport = lazy(() => import('./components/DailyReport/DailyReport'));

// 3. AI & Interactive Features
const ChatWindow = lazy(() => import('./components/chatbot/ChatWindow'));
const AIVideoMeeting = lazy(() => import('./components/AIVideoMeeting/AIVideoMeeting')); // ✅ NEW: AI Vision Module

// 4. Media & Training Resources
const Productsvideo = lazy(() => import('./components/Productsvideo/Productsvideo')); 
const LeadersVideo = lazy(() => import('./components/LeadersVideo/LeadersVideo')); 

function App() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                
                {/* ====================================================
                    PUBLIC ROUTES (No Authentication Required)
                   ==================================================== */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/payment-setup" element={<PaymentPage />} />

                {/* ====================================================
                    PROTECTED ROUTES (Requires Login)
                    Wrapped in <UserProtectedRoute> for security.
                   ==================================================== */}
                
                {/* --- Main Dashboard --- */}
                <Route 
                    path="/dashboard" 
                    element={
                        <UserProtectedRoute>
                            <UserDashboard />
                        </UserProtectedRoute>
                    } 
                />

                {/* --- New Feature: AI Live Vision Meeting --- */}
                {/* ✅ This connects the Dashboard Card to the Camera Interface */}
                <Route 
                    path="/ai-video-meeting" 
                    element={
                        <UserProtectedRoute>
                            <AIVideoMeeting />
                        </UserProtectedRoute>
                    } 
                />

                {/* --- Business Tools --- */}
                <Route 
                    path="/daily-report" 
                    element={
                        <UserProtectedRoute>
                            <DailyReport />
                        </UserProtectedRoute>
                    } 
                />

                {/* --- AI Chat Assistant --- */}
                <Route 
                    path="/chat" 
                    element={
                        <UserProtectedRoute>
                            <ChatWindow />
                        </UserProtectedRoute>
                    } 
                />

                {/* --- Training & Resources --- */}
                <Route 
                    path="/leaders-videos" 
                    element={
                        <UserProtectedRoute>
                            <LeadersVideo pageTitle="Leaders' Videos" />
                        </UserProtectedRoute>
                    } 
                />

                <Route 
                    path="/products-videos" 
                    element={
                        <UserProtectedRoute>
                            <Productsvideo pageTitle="Products' Videos" />
                        </UserProtectedRoute>
                    } 
                />
                
                {/* ====================================================
                    FALLBACK ROUTE (404 Handling)
                    Redirects unknown paths to Dashboard (or Login if not auth)
                   ==================================================== */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />

            </Routes>
        </Suspense>
    );
}

export default App;