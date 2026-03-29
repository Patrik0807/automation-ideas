import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Ideas from './pages/Ideas';
import Motive from './pages/Motive';
import Approach from './pages/Approach';
import Insights from './pages/Insights';
import IdeaDetail from './pages/IdeaDetail';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-mesh-gradient relative overflow-hidden">
      {/* Decorative Background Layer */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-60"></div>
        
        {/* Bold "Graphity" Blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary-500/15 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-orange-400/10 rounded-full blur-[100px]"></div>
        
        {/* Floating Abstract "Graphity" Elements */}
        <div className="absolute top-[15%] left-[10%] w-32 h-32 border-2 border-primary-500/10 rounded-full animate-float"></div>
        <div className="absolute bottom-[20%] right-[15%] w-48 h-48 border-2 border-blue-500/10 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Abstract Lines/Graphics - Increased Contrast */}
        <svg className="absolute top-0 right-0 w-full h-full opacity-[0.08]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0, 50 0, 100 100" stroke="currentColor" fill="transparent" strokeWidth="0.2" className="text-primary-500" />
          <path d="M0 80 C 30 20, 60 20, 100 80" stroke="currentColor" fill="transparent" strokeWidth="0.2" className="text-blue-500" />
          <path d="M0 60 C 40 40, 70 40, 100 60" stroke="currentColor" fill="transparent" strokeWidth="0.2" className="text-orange-500" />
        </svg>
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {user && <Navbar />}
        <main className="flex-1">
          <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ideas"
          element={
            <ProtectedRoute>
              <Ideas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/motive"
          element={
            <ProtectedRoute>
              <Motive />
            </ProtectedRoute>
          }
        />
        <Route
          path="/approach"
          element={
            <ProtectedRoute>
              <Approach />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <Insights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ideas/:id"
          element={
            <ProtectedRoute>
              <IdeaDetail />
            </ProtectedRoute>
          }
        />
          <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
