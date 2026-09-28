import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, MapPin, Truck, AlertCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import api from '../api';

interface Shipment {
  id: number;
  trackingNumber: string;
  senderName: string;
  receiverName: string;
  origin: string;
  destination: string;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  CREATED: 'bg-brand/10 text-brand border-brand/20',
  IN_TRANSIT: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  DELIVERED: 'bg-status-delivered/10 text-status-delivered border-status-delivered/20',
  EXCEPTION: 'bg-status-exception/10 text-status-exception border-status-exception/20'
};

const statusLabels: Record<string, string> = {
  CREATED: 'Created',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  EXCEPTION: 'Exception'
};

const Shipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShipment, setNewShipment] = useState({
    trackingNumber: '',
    senderName: '',
    receiverName: '',
    origin: '',
    destination: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      // Wait a moment for dramatic effect (optional, but looks nice in a demo)
      const response = await api.get('/gateway-proxy/shipments');
      setShipments(response.data);
      setError('');
    } catch (err: any) {
      console.error("Fetch Error:", err);
      if (err.response?.status === 401) {
        setError('Unauthorized: Your session expired. Please log out and log in again.');
      } else {
        setError(`Failed to load shipments: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await api.post('/gateway-proxy/shipments', newShipment);
      setIsModalOpen(false);
      setNewShipment({ trackingNumber: '', senderName: '', receiverName: '', origin: '', destination: '' });
      // Fetch latest list after creating
      fetchShipments();
    } catch (err) {
      console.error(err);
      alert('Failed to create shipment. Please check your inputs and try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Manage Shipments</h1>
          <p className="text-textMuted text-sm mt-1">Search, filter, and track all global shipments directly from the backend DB.</p>
        </div>
        <button 
          onClick={() => {
            setNewShipment({...newShipment, trackingNumber: `TRK${Math.floor(Math.random() * 10000)}`});
            setIsModalOpen(true);
          }}
          className="bg-brand hover:bg-brandHover text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Create Shipment
        </button>
      </div>

      {error && (
        <div className="bg-status-exception/10 border border-status-exception/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-status-exception mt-0.5" />
          <p className="text-sm text-status-exception font-medium">{error}</p>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-darkPanel border border-darkBorder rounded-xl overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-darkBorder flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={16} />
            <input 
              type="text" 
              placeholder="Search tracking number..."
              className="w-full bg-dark border border-darkBorder rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-textMuted/50 focus:outline-none focus:border-brand transition-colors"
            />
          </div>
          <button onClick={fetchShipments} className="text-brand text-sm hover:underline">Refresh Data</button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-dark/50 border-b border-darkBorder">
                <th className="py-3 px-6 text-xs font-medium text-textMuted uppercase tracking-wider">Tracking Number</th>
                <th className="py-3 px-6 text-xs font-medium text-textMuted uppercase tracking-wider">Sender</th>
                <th className="py-3 px-6 text-xs font-medium text-textMuted uppercase tracking-wider">Receiver</th>
                <th className="py-3 px-6 text-xs font-medium text-textMuted uppercase tracking-wider">Route</th>
                <th className="py-3 px-6 text-xs font-medium text-textMuted uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-xs font-medium text-textMuted uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 text-xs font-medium text-textMuted uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkBorder">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Loader2 className="animate-spin text-brand mx-auto mb-4" size={32} />
                    <p className="text-textMuted text-sm">Fetching shipments from PostgreSQL...</p>
                  </td>
                </tr>
              ) : shipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-textMuted text-sm">
                    No shipments found. Click "Create Shipment" to get started.
                  </td>
                </tr>
              ) : (
                shipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-dark/30 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-white flex items-center gap-2">
                      <Package size={16} className="text-textMuted" />
                      {shipment.trackingNumber}
                    </td>
                    <td className="py-4 px-6 text-sm text-textMuted">{shipment.senderName}</td>
                    <td className="py-4 px-6 text-sm text-textMuted">{shipment.receiverName}</td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{shipment.origin}</span>
                        <Truck size={14} className="text-textMuted/50" />
                        <span className="text-white font-medium">{shipment.destination}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={clsx(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border uppercase tracking-wider",
                        statusColors[shipment.status] || statusColors.EXCEPTION
                      )}>
                        {statusLabels[shipment.status] || shipment.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-textMuted font-mono">
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                        {shipment.status !== 'DELIVERED' && shipment.status !== 'CANCELLED' && (
                          <button 
                            onClick={async () => {
                              const nextStatus = shipment.status === 'CREATED' ? 'IN_TRANSIT' : shipment.status === 'IN_TRANSIT' ? 'OUT_FOR_DELIVERY' : 'DELIVERED';
                              try {
                                await api.patch(`/gateway-proxy/shipments/${shipment.id}/status`, { status: nextStatus });
                                fetchShipments(); // Refresh table
                              } catch (e) {
                                alert("Failed to update status.");
                              }
                            }}
                            className="px-3 py-1 bg-brand/10 text-brand border border-brand/20 hover:bg-brand hover:text-white rounded text-xs font-medium transition-colors"
                          >
                            Advance ➔
                          </button>
                        )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-darkPanel border border-darkBorder rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Create New Shipment</h2>
            
            <form onSubmit={handleCreateShipment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-textMuted uppercase mb-1">Tracking Number</label>
                <input 
                  required
                  type="text" 
                  value={newShipment.trackingNumber}
                  onChange={e => setNewShipment({...newShipment, trackingNumber: e.target.value})}
                  className="w-full bg-dark border border-darkBorder rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase mb-1">Sender Name</label>
                  <input 
                    required
                    type="text" 
                    value={newShipment.senderName}
                    onChange={e => setNewShipment({...newShipment, senderName: e.target.value})}
                    className="w-full bg-dark border border-darkBorder rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase mb-1">Receiver Name</label>
                  <input 
                    required
                    type="text" 
                    value={newShipment.receiverName}
                    onChange={e => setNewShipment({...newShipment, receiverName: e.target.value})}
                    className="w-full bg-dark border border-darkBorder rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase mb-1">Origin City</label>
                  <input 
                    required
                    type="text" 
                    value={newShipment.origin}
                    onChange={e => setNewShipment({...newShipment, origin: e.target.value})}
                    className="w-full bg-dark border border-darkBorder rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-textMuted uppercase mb-1">Destination City</label>
                  <input 
                    required
                    type="text" 
                    value={newShipment.destination}
                    onChange={e => setNewShipment({...newShipment, destination: e.target.value})}
                    className="w-full bg-dark border border-darkBorder rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-darkBorder mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-textMuted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="bg-brand hover:bg-brandHover text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-70"
                >
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Package size={16} />}
                  Save Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Shipments;
