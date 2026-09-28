import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowRight, Loader2, MapPin, Truck, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('Yash Jangra'); 
  const [password, setPassword] = useState('password');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await api.post('/auth/login', { username, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username);
        navigate('/dashboard');
      } else {
        setErrorMsg('Invalid response from server');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Login failed. Connection refused by Gateway.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans selection:bg-brand selection:text-white relative overflow-hidden">
      
      {/* Full-screen Stunning Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020817] via-[#0f172a] to-[#020817]" />
      
      {/* Animated Orbs for visual flair across the whole screen */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" style={{ animationDelay: '2s' }}/>

      {/* Left Side - Visual/Branding Showcase */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden z-10 border-r border-white/5">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-brand to-brandHover rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
            <Package size={24} className="text-white" />
          </div>
          <span className="font-bold text-3xl text-white tracking-tight">Smart Shipment</span>
        </div>

        {/* Center Value Prop */}
        <div className="relative z-10 max-w-lg mt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand text-sm font-medium mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" /> v2.0 Microservices Edition
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
            Global logistics, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-400">orchestrated.</span>
          </h1>
          <p className="text-textMuted text-lg leading-relaxed mb-10">
            Powering enterprise supply chains with real-time tracking, Kafka event streaming, and intelligent route optimization.
          </p>
          
          {/* Feature Pills */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-xl backdrop-blur-sm">
              <MapPin size={20} className="text-status-delivered" />
              <span className="text-sm font-medium text-white">Live Tracking</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-xl backdrop-blur-sm">
              <ShieldCheck size={20} className="text-brand" />
              <span className="text-sm font-medium text-white">JWT Secured</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="relative z-10 text-sm text-textMuted/60 font-medium">
          Powered by Java Spring Boot & React 18
        </div>
      </div>

      {/* Right Side - Interactive Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        
        {/* Subtle background glow for the right side */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 bg-white/[0.02] border border-white/10 p-10 rounded-3xl backdrop-blur-xl shadow-2xl">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-textMuted text-sm">Enter your credentials to access the command center.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-textMuted tracking-wider uppercase ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fa-solid fa-user text-textMuted/50 text-sm"></i>
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-textMuted/40 focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/60 transition-all shadow-inner"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-semibold text-textMuted tracking-wider uppercase">Password</label>
                <a href="#" className="text-xs font-medium text-brand hover:text-brandHover transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fa-solid fa-lock text-textMuted/50 text-sm"></i>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-textMuted/40 focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/60 transition-all shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <div className="bg-status-exception/10 border border-status-exception/30 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-status-exception mt-0.5 shrink-0" />
                <p className="text-sm text-status-exception">{errorMsg}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-brand hover:bg-brandHover text-white font-semibold rounded-xl px-4 py-3.5 flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,102,255,0.3)] disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Authenticating...
                </>
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight size={18} />
                </>
              )}
            </button>
            
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-textMuted/40 font-mono">Demo Mode: Form accepts any mock credentials.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
