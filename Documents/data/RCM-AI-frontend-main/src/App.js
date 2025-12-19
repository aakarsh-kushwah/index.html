// src/App.js

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'; // Ensure this path exists

// --- Component Imports ---
import UserProtectedRoute from './components/UserProtectedRoute'; 

// --- Lazy Loading Pages ---
const LandingPage = lazy(() => import('./components/LandingPage'));
const LoginPage = lazy(() => import('./components/login/LoginPage'));
const RegisterPage = lazy(() => import('./components/RegisterPage/RegisterPage'));
const PaymentPage = lazy(() => import('./components/PaymentPage/PaymentPage'));

// --- Protected Components ---
const UserDashboard = lazy(() => import('./components/UserDashboard/UserDashboard'));
const Productsvideo = lazy(() => import('./components/Productsvideo/Productsvideo')); 
const LeadersVideo = lazy(() => import('./components/LeadersVideo/LeadersVideo')); 
const DailyReport = lazy(() => import('./components/DailyReport/DailyReport'));

// ✅ Updated Chat Path (Ensure your file is in src/components/ChatWindow.js or update this path)
const ChatWindow = lazy(() => import('./components/chatbot/ChatWindow')); 

// ✅ NEW: AI Video Meeting
const AIVideoMeeting = lazy(() => import('./components/AIVideoMeeting/AIVideoMeeting')); 

function App() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                
                {/* --- PUBLIC ROUTES --- */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/payment-setup" element={<PaymentPage />} />

                {/* ✅ PUBLIC ACCESS: AI Video Meeting (No Login Required) */}
                <Route path="/ai-video-meeting" element={<AIVideoMeeting />} />

                {/* --- USER PROTECTED ROUTES --- */}
                <Route 
                    path="/dashboard" 
                    element={
                        <UserProtectedRoute>
                            <UserDashboard />
                        </UserProtectedRoute>
                    } 
                />

                <Route 
                    path="/daily-report" 
                    element={
                        <UserProtectedRoute>
                            <DailyReport />
                        </UserProtectedRoute>
                    } 
                />
                
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
                
                <Route 
                    path="/chat" 
                    element={
                        <UserProtectedRoute>
                            <ChatWindow />
                        </UserProtectedRoute>
                    } 
                />

                {/* FALLBACK ROUTE: Redirect unknown paths to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}

export default App;