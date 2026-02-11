import React from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from './ui/Avatar';
import { LayoutGrid, Calendar, Users, Settings, Sun, Moon, LogOut, UserCog, HeartPulse } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarItem: React.FC<{ item: any; isActive: boolean }> = ({ item, isActive }) => (
  <Link 
    to={item.path}
    className={`
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
      ${isActive 
        ? 'bg-blue-50/80 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 font-bold shadow-sm' 
        : 'text-gray-500 hover:bg-gray-100/50 dark:text-gray-400 dark:hover:bg-slate-800/50 font-medium'
      }
    `}
  >
    <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
    <span>{item.label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, theme, toggleTheme, logout } = useApp();
  const location = useLocation();

  const navItems = [
    { icon: Calendar, label: 'Hoje', path: '/' },
    { icon: LayoutGrid, label: 'Tarefas', path: '/tasks' },
    { icon: Users, label: 'Idosos', path: '/profiles' },
  ];

  if (currentUser?.role === 'ADMIN') {
      navItems.push({ icon: UserCog, label: 'Usuários', path: '/users' });
  }

  navItems.push({ icon: Settings, label: 'Config', path: '/settings' });

  return (
    <div className="flex h-screen bg-dot-pattern text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-200">
      
      <aside className="hidden md:flex flex-col w-72 glass-panel h-full p-5 shrink-0 z-20">
        <div className="flex items-center gap-3 px-2 mb-10 mt-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 ring-2 ring-white dark:ring-slate-700">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-2xl text-gray-800 dark:text-white tracking-tight leading-none">CareSync</h1>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold ml-0.5">Family</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => (
            <SidebarItem key={item.path} item={item} isActive={location.pathname === item.path} />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-slate-700/50 space-y-4">
            <div className="flex items-center justify-between px-2">
                <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Preferências</span>
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 transition-colors text-gray-600 dark:text-gray-300"
                >
                    {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 shadow-sm backdrop-blur-sm">
                <Avatar src={currentUser?.avatarUrl || ''} alt={currentUser?.name || 'U'} size="sm" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate dark:text-white">{currentUser?.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate uppercase font-semibold tracking-wide">{currentUser?.role}</p>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
            </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full w-full relative">
        
        <header className="md:hidden glass-panel border-b-0 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-gray-800 dark:text-white tracking-tight">CareSync</h1>
          </div>
          <div className="flex items-center gap-3">
              <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <Avatar src={currentUser?.avatarUrl || ''} alt={currentUser?.name || ''} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar pb-24 md:pb-0 transition-colors duration-200">
          <div className="max-w-5xl mx-auto w-full md:px-6 md:py-6">
             {children}
          </div>
        </main>

        <nav className="md:hidden absolute bottom-0 left-0 right-0 glass-panel border-t border-gray-100 dark:border-slate-700/50 px-6 py-3 flex justify-between items-center z-30 pb-safe shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-blue-600 dark:text-blue-400 scale-105' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}
              >
                <div className={`p-1 rounded-xl ${isActive ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                   <item.icon className={`w-6 h-6 ${isActive ? 'fill-blue-500/20' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  );
};