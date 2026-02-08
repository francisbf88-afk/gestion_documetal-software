import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DocumentList from './components/DocumentList';
import DocumentViewer from './components/DocumentViewer';
import DocumentEditor from './components/DocumentEditor';
import UploadDocument from './components/UploadDocument';
import UserManagement from './components/UserManagement';
import CategoryManagement from './components/CategoryManagement';
import TestConnection from './components/TestConnection';
import Help from './components/Help';
import theme from './theme/theme';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <DocumentList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents/:id"
                element={
                  <ProtectedRoute>
                    <DocumentViewer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'editor']}>
                    <DocumentEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'editor']}>
                    <UploadDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <CategoryManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test-connection"
                element={<TestConnection />}
              />
              <Route
                path="/help"
                element={
                  <ProtectedRoute>
                    <Help />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
