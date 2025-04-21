import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <div className="text-white">Access denied. Admin only.</div>;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#121212] min-h-screen p-4">
          <h1 className="text-xl font-bold mb-8">Admin Panel</h1>
          <nav className="space-y-2">
            <Link
              to="/admin/dashboard"
              className={`block px-4 py-2 rounded ${
                isActive('/admin/dashboard')
                  ? 'bg-[#7747ff] text-white'
                  : 'hover:bg-[#282828]'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className={`block px-4 py-2 rounded ${
                isActive('/admin/users')
                  ? 'bg-[#7747ff] text-white'
                  : 'hover:bg-[#282828]'
              }`}
            >
              User Management
            </Link>
            <Link
              to="/admin/songs"
              className={`block px-4 py-2 rounded ${
                isActive('/admin/songs')
                  ? 'bg-[#7747ff] text-white'
                  : 'hover:bg-[#282828]'
              }`}
            >
              Song Management
            </Link>
            <Link
              to="/admin/playlists"
              className={`block px-4 py-2 rounded ${
                isActive('/admin/playlists')
                  ? 'bg-[#7747ff] text-white'
                  : 'hover:bg-[#282828]'
              }`}
            >
              Playlist Management
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 