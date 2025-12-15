import React from 'react';
import { User } from '../types';
import { LogOut, Terminal, Github, User as UserIcon } from 'lucide-react';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-forge-bg text-forge-text font-sans">
      {/* Header */}
      <header className="h-16 border-b border-forge-border bg-forge-card px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-aws-orange p-1.5 rounded-lg shadow-lg shadow-orange-500/20">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Lambda Forge
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-forge-bg border border-forge-border">
              {user.provider === 'github' ? <Github size={14} /> : <div className="w-3.5 h-3.5 rounded-full bg-blue-500" />}
              <span className="text-sm font-medium text-gray-300">{user.name}</span>
              <img src={user.avatar} alt="User" className="w-6 h-6 rounded-full border border-gray-600" />
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
};
