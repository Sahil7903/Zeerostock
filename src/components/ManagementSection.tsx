import React, { useState, useEffect } from 'react';
import { Plus, Building2, Package, CheckCircle2, AlertCircle } from 'lucide-react';

interface Supplier {
  id: number;
  name: string;
  city: string;
}

export default function ManagementSection() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [activeTab, setActiveTab] = useState<'supplier' | 'inventory'>('supplier');
  
  // Supplier Form
  const [sName, setSName] = useState('');
  const [sCity, setSCity] = useState('');
  
  // Inventory Form
  const [iSupplier, setISupplier] = useState('');
  const [iName, setIName] = useState('');
  const [iCategory, setICategory] = useState('Electronics');
  const [iQty, setIQty] = useState('');
  const [iPrice, setIPrice] = useState('');

  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchSuppliers = async () => {
    const res = await fetch('/api/suppliers');
    const data = await res.json();
    setSuppliers(data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting new supplier:", { sName, sCity });
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/supplier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sName, city: sCity })
      });
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Failed to add supplier:", data.error);
        throw new Error(data.error);
      }

      console.log("Supplier added successfully:", data);
      setMessage({ type: 'success', text: `Supplier "${data.name}" added successfully!` });
      setSName('');
      setSCity('');
      fetchSuppliers();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting new inventory item:", { iSupplier, iName, iCategory, iQty, iPrice });
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplier_id: iSupplier,
          product_name: iName,
          category: iCategory,
          quantity: iQty,
          price: iPrice
        })
      });
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Failed to add inventory:", data.error);
        throw new Error(data.error);
      }

      console.log("Inventory added successfully:", data);
      setMessage({ type: 'success', text: `Product "${data.product_name}" added to inventory!` });
      setIName('');
      setIQty('');
      setIPrice('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => { setActiveTab('supplier'); setMessage({ type: '', text: '' }); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${activeTab === 'supplier' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Building2 className="w-4 h-4" />
          Add Supplier
        </button>
        <button
          onClick={() => { setActiveTab('inventory'); setMessage({ type: '', text: '' }); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${activeTab === 'inventory' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Package className="w-4 h-4" />
          Add Inventory
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {activeTab === 'supplier' ? (
          <form onSubmit={handleAddSupplier} className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Building2 className="text-blue-600" />
              Supplier Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  required
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  required
                  value={sCity}
                  onChange={(e) => setSCity(e.target.value)}
                  placeholder="e.g. Bangalore"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
            >
              <Plus className="w-5 h-5" />
              Register Supplier
            </button>
          </form>
        ) : (
          <form onSubmit={handleAddInventory} className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Package className="text-blue-600" />
              Inventory Item
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                <select
                  required
                  value={iSupplier}
                  onChange={(e) => setISupplier(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select a supplier...</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  required
                  value={iName}
                  onChange={(e) => setIName(e.target.value)}
                  placeholder="e.g. Office Chair"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={iCategory}
                  onChange={(e) => setICategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Construction">Construction</option>
                  <option value="Stationery">Stationery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={iQty}
                  onChange={(e) => setIQty(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={iPrice}
                  onChange={(e) => setIPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
            >
              <Plus className="w-5 h-5" />
              Add to Inventory
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
