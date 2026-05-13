import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Funds from './pages/Funds';
import Investments from './pages/Investments';

function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111827',
              color: '#e8f0fe',
              border: '1px solid #1e2d45',
              fontFamily: "'Syne', sans-serif",
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#00d4aa', secondary: '#111827' } },
            error:   { iconTheme: { primary: '#ff4d6d', secondary: '#111827' } },
          }}
        />
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/funds"       element={<ProtectedRoute><Layout><Funds /></Layout></ProtectedRoute>} />
          <Route path="/investments" element={<ProtectedRoute><Layout><Investments /></Layout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
