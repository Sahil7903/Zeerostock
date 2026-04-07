import React, { useState } from 'react';
import { LayoutDashboard, Search as SearchIcon, Database, Box } from 'lucide-react';
import SearchSection from './components/SearchSection';
import ManagementSection from './components/ManagementSection';
import GroupedView from './components/GroupedView';

type Tab = 'search' | 'manage' | 'analytics';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('search');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar / Navigation */}
      <nav className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 text-blue-600 mb-8">
            <Box className="w-8 h-8" />
            <h1 className="text-2xl font-black tracking-tight">ZeeroStock</h1>
          </div>
          
          <div className="space-y-2">
            <NavItem 
              active={activeTab === 'search'} 
              onClick={() => setActiveTab('search')}
              icon={<SearchIcon className="w-5 h-5" />}
              label="Search Inventory"
            />
            <NavItem 
              active={activeTab === 'manage'} 
              onClick={() => setActiveTab('manage')}
              icon={<Database className="w-5 h-5" />}
              label="Data Management"
            />
            <NavItem 
              active={activeTab === 'analytics'} 
              onClick={() => setActiveTab('analytics')}
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Supplier Analytics"
            />
          </div>
        </div>
        
        <div className="mt-auto p-8">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-xs font-bold text-blue-600 uppercase mb-1">Status</p>
            <p className="text-sm text-blue-800 font-medium">System Online</p>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className="lg:hidden bg-white border-b border-gray-100 p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600">
          <Box className="w-6 h-6" />
          <span className="font-black">ZeeroStock</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('search')} className={activeTab === 'search' ? 'text-blue-600' : 'text-gray-400'}>
            <SearchIcon className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveTab('manage')} className={activeTab === 'manage' ? 'text-blue-600' : 'text-gray-400'}>
            <Database className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveTab('analytics')} className={activeTab === 'analytics' ? 'text-blue-600' : 'text-gray-400'}>
            <LayoutDashboard className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 p-8 lg:p-12 flex flex-col min-h-screen">
        <div className="flex-grow">
          <header className="mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              {activeTab === 'search' && 'Inventory Search'}
              {activeTab === 'manage' && 'Inventory Management'}
              {activeTab === 'analytics' && 'Supplier Analytics'}
            </h2>
            <p className="text-gray-500 font-medium">
              {activeTab === 'search' && 'Find surplus stock across all verified suppliers.'}
              {activeTab === 'manage' && 'Register new suppliers and update stock levels.'}
              {activeTab === 'analytics' && 'Overview of inventory value grouped by supplier.'}
            </p>
          </header>

          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'search' && <SearchSection />}
            {activeTab === 'manage' && <ManagementSection />}
            {activeTab === 'analytics' && <GroupedView />}
          </section>
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
          <p>ZeeroStock &copy; 2026 | Developed by Sahil</p>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

