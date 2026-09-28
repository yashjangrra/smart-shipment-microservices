import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Key, User, Check, Copy } from 'lucide-react';
import { clsx } from 'clsx';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [copied, setCopied] = useState(false);
  const jwt = localStorage.getItem('token') || 'eyJhbGci...';
  const username = localStorage.getItem('username') || 'User';

  const handleCopyJWT = () => {
    navigator.clipboard.writeText(jwt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Platform Settings</h1>
          <p className="text-textMuted text-sm mt-1">Manage your account and system preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left",
                activeTab === 'profile' ? "bg-brand/10 text-brand border border-brand/20" : "text-textMuted hover:bg-white/5 hover:text-white"
            )}
          >
            <User size={18} />
            Profile Information
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left",
                activeTab === 'notifications' ? "bg-brand/10 text-brand border border-brand/20" : "text-textMuted hover:bg-white/5 hover:text-white"
            )}
          >
            <Bell size={18} />
            Alerts & Notifications
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left",
                activeTab === 'security' ? "bg-brand/10 text-brand border border-brand/20" : "text-textMuted hover:bg-white/5 hover:text-white"
            )}
          >
            <Shield size={18} />
            Security & JWT
          </button>
          <button 
            onClick={() => setActiveTab('api')}
            className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left",
                activeTab === 'api' ? "bg-brand/10 text-brand border border-brand/20" : "text-textMuted hover:bg-white/5 hover:text-white"
            )}
          >
            <Key size={18} />
            API Keys
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-darkPanel border border-darkBorder rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-4">Profile Information</h2>
                <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-textMuted uppercase mb-1">Username</label>
                    <input 
                    type="text" 
                    defaultValue={username}
                    disabled
                    className="w-full bg-dark/50 border border-darkBorder rounded-lg px-4 py-2 text-white/50 cursor-not-allowed" 
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-textMuted uppercase mb-1">Role & Permissions</label>
                    <input 
                    type="text" 
                    defaultValue="SYSTEM_ADMINISTRATOR"
                    disabled
                    className="w-full bg-dark/50 border border-darkBorder rounded-lg px-4 py-2 text-brand cursor-not-allowed font-mono text-sm" 
                    />
                </div>
                </div>
                <div className="mt-6 pt-6 border-t border-darkBorder">
                <p className="text-xs text-textMuted">These settings are managed centrally by your Spring Boot Auth Service. Profile editing is disabled for this demo.</p>
                </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="bg-darkPanel border border-darkBorder rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-4">Kafka Alert Preferences</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-darkBorder rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-white">Exception Alerts</p>
                            <p className="text-xs text-textMuted">Notify me when a shipment is delayed</p>
                        </div>
                        <div className="w-10 h-5 bg-brand rounded-full relative cursor-not-allowed opacity-50"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div></div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-darkBorder rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-white">System Health Alerts</p>
                            <p className="text-xs text-textMuted">Notify me if a microservice drops from Eureka</p>
                        </div>
                        <div className="w-10 h-5 bg-brand rounded-full relative cursor-not-allowed opacity-50"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div></div>
                    </div>
                </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="bg-darkPanel border border-darkBorder rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-4 flex items-center justify-between">
                    Active Session Token
                    <button onClick={handleCopyJWT} className="flex items-center gap-1 text-xs text-brand hover:text-white transition-colors">
                        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy JWT'}
                    </button>
                </h2>
                <p className="text-xs text-textMuted mb-4">This is the JSON Web Token (JWT) generated by your Auth Service. It is automatically injected into all your API Gateway requests.</p>
                <div className="bg-dark p-4 rounded-lg border border-darkBorder break-all">
                    <code className="text-xs font-mono text-status-delivered">{jwt}</code>
                </div>
            </div>
          )}

          {/* API KEYS TAB */}
          {activeTab === 'api' && (
            <div className="bg-darkPanel border border-darkBorder rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-4">Developer API Keys</h2>
                <p className="text-xs text-textMuted mb-4">Use this key to authenticate external B2B clients directly with the API Gateway Rate Limiter.</p>
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-textMuted uppercase">Production Key</label>
                    <div className="flex gap-2">
                        <input type="password" defaultValue="sk_live_8f92a3b1c4d5e6f7g8h9i0j" disabled className="w-full bg-dark/50 border border-darkBorder rounded-lg px-4 py-2 text-white/50 cursor-not-allowed font-mono" />
                        <button disabled className="px-4 py-2 bg-dark border border-darkBorder rounded-lg text-textMuted text-sm cursor-not-allowed">Reveal</button>
                    </div>
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
