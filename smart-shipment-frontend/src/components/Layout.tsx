import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Activity, Settings, LogOut, Bell } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens here in the future
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Shipments', path: '/shipments', icon: Package },
    { name: 'System Health', path: '/health', icon: Activity },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-dark">
      {/* Sidebar */}
      <aside className="w-64 border-r border-darkBorder bg-darkPanel flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-darkBorder">
          <div className="flex items-center gap-2 text-brand">
            <Package size={24} />
            <span className="font-semibold text-lg text-white">Smart Shipment</span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-brand/10 text-brand' 
                    : 'text-textMuted hover:bg-darkBorder/50 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-darkBorder">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-textMuted hover:bg-darkBorder/50 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-darkBorder bg-dark/50 backdrop-blur flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 text-sm text-textMuted">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-status-delivered animate-pulse" />
              <span>System Operational</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4">
              <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand flex items-center justify-center text-brand font-medium">
                {(localStorage.getItem('username') || 'User').substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{localStorage.getItem('username') || 'User'}</span>
                <span className="text-xs text-textMuted">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
