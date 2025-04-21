import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Player from '../Player/Player';

const MainLayout: React.FC = () => {
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-6">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Player */}
      <Player />
    </div>
  );
};

export default MainLayout; 