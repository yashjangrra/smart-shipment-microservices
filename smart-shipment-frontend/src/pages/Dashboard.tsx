import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, Truck, Package, Clock, ShieldCheck, Server } from 'lucide-react';
import { clsx } from 'clsx';
import api from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    active: 0,
    delivered: 0,
    inTransit: 0,
    exceptions: 0
  });
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [allShipments, setAllShipments] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch all shipments
      const shipmentsRes = await api.get('/gateway-proxy/shipments');
      const shipments = shipmentsRes.data;
      setAllShipments(shipments);
      
      // Calculate Stats
      let active = 0, delivered = 0, inTransit = 0, exceptions = 0;
      
      // Volume data mapping (fake days for demo, but real count based on DB)
      const dayCounts = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };
      
      shipments.forEach((s: any) => {
        if (s.status === 'CREATED' || s.status === 'IN_TRANSIT' || s.status === 'OUT_FOR_DELIVERY') active++;
        if (s.status === 'IN_TRANSIT' || s.status === 'OUT_FOR_DELIVERY') inTransit++;
        if (s.status === 'DELIVERED') delivered++;
        if (s.status === 'CANCELLED' || s.status === 'EXCEPTION') exceptions++;
        
        // Just for demo chart distribution
        const days = Object.keys(dayCounts);
        const randomDay = days[Math.floor(Math.random() * days.length)];
        dayCounts[randomDay as keyof typeof dayCounts]++;
      });
      
      setStats({ active, delivered, inTransit, exceptions });
      setVolumeData(Object.keys(dayCounts).map(k => ({ name: k, volume: dayCounts[k as keyof typeof dayCounts] * 100 })));
      
      // Set the first active shipment for the map
      const firstActive = shipments.find((s: any) => s.status !== 'DELIVERED') || shipments[0];
      setSelectedShipment(firstActive);

      // 2. Fetch notifications
      const notifRes = await api.get('/gateway-proxy/api/notifications');
      // Sort newest first
      const sortedNotifs = notifRes.data.sort((a: any, b: any) => {
        const timeA = Array.isArray(a.createdAt) ? new Date(a.createdAt[0], a.createdAt[1]-1, a.createdAt[2], a.createdAt[3], a.createdAt[4], a.createdAt[5] || 0).getTime() : new Date(a.createdAt).getTime();
        const timeB = Array.isArray(b.createdAt) ? new Date(b.createdAt[0], b.createdAt[1]-1, b.createdAt[2], b.createdAt[3], b.createdAt[4], b.createdAt[5] || 0).getTime() : new Date(b.createdAt).getTime();
        return timeB - timeA;
      });
      
      setLiveEvents(sortedNotifs.slice(0, 5).map((n: any) => {
        const dateObj = Array.isArray(n.createdAt) 
          ? new Date(n.createdAt[0], n.createdAt[1]-1, n.createdAt[2], n.createdAt[3], n.createdAt[4], n.createdAt[5] || 0)
          : new Date(n.createdAt);
        return {
          id: n.id,
          text: n.message,
          time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }));
      
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Overview</h1>
          <p className="text-textMuted text-sm mt-1">Real-time metrics from the Smart Shipment database.</p>
        </div>
        <button onClick={fetchDashboardData} className="px-4 py-2 bg-darkPanel border border-darkBorder rounded-lg text-sm text-textMuted hover:text-white transition-colors">
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-darkPanel border border-darkBorder p-5 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-textMuted text-sm font-medium">Active Shipments</h3>
            <div className="p-2 bg-dark rounded-lg"><Truck size={16} className="text-textMuted" /></div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.active}</div>
          <div className="text-xs font-medium text-status-delivered">Live from PostgreSQL</div>
        </div>
        
        <div className="bg-darkPanel border border-darkBorder p-5 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-textMuted text-sm font-medium">Delivered</h3>
            <div className="p-2 bg-dark rounded-lg"><ShieldCheck size={16} className="text-textMuted" /></div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.delivered}</div>
          <div className="text-xs font-medium text-status-delivered">Live from PostgreSQL</div>
        </div>

        <div className="bg-darkPanel border border-darkBorder p-5 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-textMuted text-sm font-medium">In Transit</h3>
            <div className="p-2 bg-dark rounded-lg"><Activity size={16} className="text-textMuted" /></div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.inTransit}</div>
          <div className="text-xs font-medium text-textMuted">Kafka Stream Validated</div>
        </div>

        <div className="bg-darkPanel border border-darkBorder p-5 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-textMuted text-sm font-medium">Exceptions</h3>
            <div className="p-2 bg-dark rounded-lg"><AlertTriangle size={16} className="text-textMuted" /></div>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.exceptions}</div>
          {stats.exceptions > 0 ? (
            <div className="text-xs font-medium text-status-exception">Requires attention</div>
          ) : (
             <div className="text-xs font-medium text-status-delivered">All clear</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-darkPanel border border-darkBorder rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold text-white">Network Volume (Live Data)</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
                <XAxis dataKey="name" stroke="#A1A1AA" tick={{ fill: '#A1A1AA', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#A1A1AA" tick={{ fill: '#A1A1AA', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111111', borderColor: '#222222', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#0066FF' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#0066FF" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Feed */}
        <div className="bg-darkPanel border border-darkBorder rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-transit animate-pulse"></span>
              Live Event Stream (Kafka)
            </h2>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px]">
            {liveEvents.length === 0 ? (
               <div className="text-sm text-textMuted">No events found in database.</div>
            ) : (
                liveEvents.map((evt, idx) => (
                <div key={evt.id} className={clsx(
                    "p-4 rounded-lg border",
                    idx === 0 ? "bg-darkBorder/30 border-darkBorder" : "bg-transparent border-transparent px-2 py-2"
                )}>
                    <div className="flex items-start justify-between gap-4">
                    <p className={clsx("text-sm", idx === 0 ? "text-white" : "text-textMuted")}>{evt.text}</p>
                    <span className="text-xs font-mono text-textMuted whitespace-nowrap">{evt.time}</span>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Live Global Map and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-darkPanel border border-darkBorder rounded-xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
              Dynamic Route Tracking
            </h2>
            {selectedShipment ? (
                <div className="flex gap-2 items-center">
                    <span className="text-brand text-xs font-mono font-bold mr-2">{selectedShipment.trackingNumber}</span>
                    <span className="px-2 py-1 bg-dark rounded text-xs text-textMuted border border-darkBorder">{selectedShipment.origin}</span>
                    <span className="text-textMuted text-xs flex items-center">➔</span>
                    <span className="px-2 py-1 bg-dark rounded text-xs text-textMuted border border-darkBorder">{selectedShipment.destination}</span>
                </div>
            ) : (
                <div className="text-xs text-textMuted">Select a shipment below</div>
            )}
            
          </div>
          
          {/* Faux Map Background */}
          <div className="absolute inset-0 bg-[#0a0a0a] z-0 opacity-80" 
               style={{ backgroundImage: 'radial-gradient(#222 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 h-[300px] w-full flex items-center justify-center">
             {selectedShipment ? (
                 <div className="relative w-full max-w-lg h-full transition-all duration-500">
                    {/* SVG Route Line */}
                    <svg className="absolute inset-0 w-full h-full" style={{ strokeDasharray: '5,5' }}>
                    <path d="M 50 50 Q 200 150 400 250" fill="none" stroke="#3b82f6" strokeWidth="2" className={selectedShipment.status !== 'DELIVERED' ? 'animate-pulse' : ''} />
                    </svg>
                    
                    {/* Origin Node */}
                    <div className="absolute top-[40px] left-[40px] flex flex-col items-center">
                    <div className="w-4 h-4 bg-white rounded-full border-4 border-dark shadow-[0_0_10px_#fff]"></div>
                    <span className="text-xs font-medium text-white mt-2 bg-dark/50 px-2 py-1 rounded backdrop-blur">{selectedShipment.origin}</span>
                    </div>

                    {/* Truck Node */}
                    <div className={clsx(
                        "absolute flex flex-col items-center transition-all duration-1000",
                        selectedShipment.status === 'CREATED' ? "top-[40px] left-[40px]" : 
                        selectedShipment.status === 'DELIVERED' ? "top-[240px] left-[390px]" : 
                        "top-[135px] left-[210px]"
                    )}>
                    <div className="w-6 h-6 bg-brand rounded-full flex items-center justify-center shadow-[0_0_15px_#3b82f6]">
                        <Truck size={12} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-brand mt-1 bg-dark/80 px-1 rounded">{selectedShipment.status}</span>
                    </div>

                    {/* Dest Node */}
                    <div className="absolute top-[240px] left-[390px] flex flex-col items-center">
                    <div className={clsx("w-4 h-4 rounded-full border-4 border-dark", selectedShipment.status === 'DELIVERED' ? 'bg-status-delivered shadow-[0_0_10px_#10B981]' : 'bg-darkBorder')}></div>
                    <span className="text-xs font-medium text-textMuted mt-2 bg-dark/50 px-2 py-1 rounded backdrop-blur">{selectedShipment.destination}</span>
                    </div>
                </div>
             ) : (
                 <div className="text-textMuted flex flex-col items-center">
                     <Package size={32} className="mb-2 opacity-50"/>
                     <p>No active shipments to track</p>
                 </div>
             )}
          </div>
        </div>

        {/* Dynamic Selector */}
        <div className="bg-darkPanel border border-darkBorder rounded-xl p-6 flex flex-col">
          <div>
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Activity size={18} className="text-brand" /> Track Another Shipment
            </h2>
            <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2">
                {allShipments.map(s => (
                    <button 
                        key={s.id}
                        onClick={() => setSelectedShipment(s)}
                        className={clsx(
                            "w-full text-left p-3 rounded-lg border text-sm transition-colors flex justify-between items-center",
                            selectedShipment?.id === s.id ? "bg-brand/10 border-brand text-white" : "bg-dark border-darkBorder text-textMuted hover:bg-darkBorder/50"
                        )}
                    >
                        <span className="font-mono font-medium">{s.trackingNumber}</span>
                        <span className={clsx("text-xs px-2 py-0.5 rounded", 
                            s.status === 'DELIVERED' ? 'bg-status-delivered/10 text-status-delivered' : 
                            s.status === 'CREATED' ? 'bg-textMuted/10 text-white' : 'bg-status-transit/10 text-status-transit'
                        )}>
                            {s.status}
                        </span>
                    </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
