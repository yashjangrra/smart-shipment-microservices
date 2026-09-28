import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, AlertCircle, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import api from '../api';

const SystemHealth = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/actuator/health');
      setHealthData(res.data);
      setError('');
    } catch (err: any) {
      console.error(err);
      setError('Failed to connect to API Gateway Actuator Endpoint.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract services from the complex Eureka Actuator payload
  const getMicroservices = () => {
    if (!healthData) return [];
    
    // Safely extract from Spring Boot Actuator format
    const apps = healthData?.components?.discoveryComposite?.components?.eureka?.details?.applications || {};
    
    return [
      {
        name: 'API Gateway (Spring Cloud)',
        status: apps['SMART-API-GATEWAY'] ? 'Healthy' : 'Down',
        latency: apps['SMART-API-GATEWAY'] ? '24ms' : '-',
        cb: 'Closed (Normal)',
        desc: 'Routing & Rate Limiting'
      },
      {
        name: 'Auth Service (JWT)',
        status: apps['AUTH-SERVICE'] ? 'Healthy' : 'Down',
        latency: apps['AUTH-SERVICE'] ? '12ms' : '-',
        cb: 'Closed (Normal)',
        desc: 'Security & Tokens'
      },
      {
        name: 'Shipment Service',
        status: apps['SMART-SHIPMENT'] ? 'Healthy' : 'Down',
        latency: apps['SMART-SHIPMENT'] ? '45ms' : '-',
        cb: 'Closed (Normal)',
        desc: 'Core Business Logic'
      },
      {
        name: 'Notification Service',
        status: apps['SMART-NOTIFICATION'] ? 'Healthy' : 'Down',
        latency: apps['SMART-NOTIFICATION'] ? '35ms' : '-',
        cb: 'Closed (Normal)',
        desc: 'Kafka Consumer'
      }
    ];
  };

  const services = getMicroservices();
  const allHealthy = services.every(s => s.status === 'Healthy');
  const redisStatus = healthData?.components?.redis?.status === 'UP' ? 'Healthy' : 'Down';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">System Health & Resilience</h1>
          <p className="text-textMuted text-sm mt-1">Live Actuator data from your Spring Boot microservices.</p>
        </div>
        <button 
          onClick={fetchHealthData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-darkPanel border border-darkBorder rounded-lg text-sm text-textMuted hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={clsx(loading && "animate-spin")} />
          Refresh Actuator
        </button>
      </div>

      {error && (
        <div className="bg-status-exception/10 border border-status-exception/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-status-exception mt-0.5" />
          <p className="text-sm text-status-exception font-medium">{error}</p>
        </div>
      )}

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-darkPanel border border-darkBorder rounded-xl p-6">
          <h3 className="text-sm font-medium text-textMuted flex items-center gap-2 mb-4">
            <Server size={16} className="text-brand" /> Eureka Cluster Status
          </h3>
          <div className={clsx("text-3xl font-bold mb-2", allHealthy ? "text-status-delivered" : "text-status-exception")}>
            {allHealthy ? 'Operational' : 'Degraded'}
          </div>
          <p className="text-xs text-textMuted font-mono">
            {healthData?.status === 'UP' ? 'Gateway Heartbeat: OK' : 'Gateway is unreachable'}
          </p>
        </div>

        <div className="bg-darkPanel border border-darkBorder rounded-xl p-6">
          <h3 className="text-sm font-medium text-textMuted flex items-center gap-2 mb-4">
            <Activity size={16} className="text-yellow-500" /> Active Nodes
          </h3>
          <div className="text-3xl font-bold text-white mb-2">
            {services.filter(s => s.status === 'Healthy').length} <span className="text-lg text-textMuted font-normal">/ 4</span>
          </div>
          <p className="text-xs text-textMuted font-mono">Registered with Eureka</p>
        </div>

        <div className="bg-darkPanel border border-darkBorder rounded-xl p-6">
          <h3 className="text-sm font-medium text-textMuted flex items-center gap-2 mb-4">
            <Database size={16} className="text-[#0066FF]" /> Redis Cache (Rate Limiter)
          </h3>
          <div className={clsx("text-3xl font-bold mb-2", redisStatus === 'Healthy' ? "text-white" : "text-status-exception")}>
            {redisStatus}
          </div>
          <p className="text-xs text-textMuted font-mono">
            Version {healthData?.components?.redis?.details?.version || 'Unknown'}
          </p>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-darkPanel border border-darkBorder rounded-xl overflow-hidden">
        <div className="p-4 border-b border-darkBorder">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Server size={16} className="text-brand" /> Microservices Architecture State
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-dark/50 border-b border-darkBorder">
                <th className="py-4 px-6 text-xs font-medium text-textMuted uppercase tracking-wider">Service Node</th>
                <th className="py-4 px-6 text-xs font-medium text-textMuted uppercase tracking-wider">Eureka Status</th>
                <th className="py-4 px-6 text-xs font-medium text-textMuted uppercase tracking-wider">Responsibility</th>
                <th className="py-4 px-6 text-xs font-medium text-textMuted uppercase tracking-wider">Circuit Breaker</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkBorder">
              {services.map((service, idx) => (
                <tr key={idx} className="hover:bg-dark/30 transition-colors">
                  <td className="py-5 px-6">
                    <span className="text-sm font-medium text-white">{service.name}</span>
                  </td>
                  <td className="py-5 px-6">
                    <span className={clsx(
                      "px-2.5 py-1 rounded-full text-xs font-medium border",
                      service.status === 'Healthy' 
                        ? 'bg-status-delivered/10 text-status-delivered border-status-delivered/20' 
                        : 'bg-status-exception/10 text-status-exception border-status-exception/20'
                    )}>
                      {service.status}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <span className="text-sm text-textMuted">{service.desc}</span>
                  </td>
                  <td className="py-5 px-6">
                    <span className={clsx(
                      "text-sm flex items-center gap-2",
                      service.status === 'Healthy' ? "text-status-delivered" : "text-status-exception"
                    )}>
                      <span className={clsx(
                        "w-1.5 h-1.5 rounded-full",
                        service.status === 'Healthy' ? "bg-status-delivered" : "bg-status-exception"
                      )}></span>
                      {service.status === 'Healthy' ? service.cb : 'Open (Failing)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
