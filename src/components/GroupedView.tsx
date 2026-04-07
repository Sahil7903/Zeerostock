import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Package2 } from 'lucide-react';

interface GroupedData {
  supplier_id: number;
  supplier_name: string;
  total_value: number;
  item_count: number;
}

export default function GroupedView() {
  const [data, setData] = useState<GroupedData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroupedData = async () => {
    console.log("Fetching grouped analytics data...");
    setLoading(true);
    try {
      const res = await fetch('/api/inventory/grouped');
      const json = await res.json();
      console.log("Analytics data loaded:", json);
      setData(json);
    } catch (err) {
      console.error('Failed to fetch grouped data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupedData();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Calculating inventory values...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="text-blue-600" />
          Supplier Performance
        </h3>
        <button 
          onClick={fetchGroupedData}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, index) => (
          <div key={item.supplier_id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              {index === 0 ? <TrendingUp className="w-12 h-12 text-green-600" /> : <Package2 className="w-12 h-12 text-blue-600" />}
            </div>
            
            <div className="relative z-10">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Supplier</p>
              <h4 className="text-lg font-bold text-gray-800 mb-4">{item.supplier_name}</h4>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Inventory Value</p>
                  <p className="text-2xl font-black text-blue-600">₹{item.total_value.toLocaleString()}</p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                  <Package2 className="w-4 h-4" />
                  <span>{item.item_count} unique products</span>
                </div>
              </div>
            </div>

            {index === 0 && (
              <div className="mt-4 pt-4 border-t border-gray-50">
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Top Supplier</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <p className="text-gray-500">No data available. Add some inventory first!</p>
        </div>
      )}
    </div>
  );
}
