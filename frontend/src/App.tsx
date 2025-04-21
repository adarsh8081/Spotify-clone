import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Player from './components/Player';
import Sidebar from './components/Sidebar';

// PrivateRoute Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Main App Content
const AppContent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            }
          />
          <Route
            path="/library"
            element={
              <PrivateRoute>
                <Library />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      {/* Player */}
      <Player />
    </div>
  );
};

// Root App Component
const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <PlayerProvider>
            <AppContent />
          </PlayerProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;