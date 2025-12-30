import React, { useState, useEffect } from 'react';
import { UserProfile, ViewState, InventoryItem, Customer, PaymentType } from './types';
import { MOCK_INVENTORY, MOCK_CUSTOMERS } from './constants';
import Auth from './components/Auth';
import Inventory from './components/Inventory';
import CustomerLedger from './components/CustomerLedger';
import Assistant from './components/Assistant';
import { LayoutDashboard, Car, Users, LogOut, Menu, Wallet, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<ViewState>('DASHBOARD');
  
  // State for data management
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);

  // Load from local storage on mount (simulated persistence)
  useEffect(() => {
    const savedUser = localStorage.getItem('khata_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (companyName: string, address: string) => {
    const newUser = { companyName, address, email: 'demo@example.com' };
    setUser(newUser);
    localStorage.setItem('khata_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('khata_user');
  };

  const handleAddInventory = (newItemData: Omit<InventoryItem, 'id' | 'sNo'>) => {
    const newItem: InventoryItem = {
      ...newItemData,
      id: Date.now().toString(),
      sNo: inventory.length + 1,
    };
    setInventory([newItem, ...inventory]);
  };

  const handleDeleteInventory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle from stock?')) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAddCustomer = (newCustomerData: Omit<Customer, 'id' | 'lastPaymentDate' | 'history'>) => {
    const newCustomer: Customer = {
      ...newCustomerData,
      id: Date.now().toString(),
      lastPaymentDate: new Date().toISOString().split('T')[0],
      history: []
    };
    setCustomers([newCustomer, ...customers]);
  };

  const handleDeleteCustomer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer? This will remove all their payment history and balance data.')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleAddPayment = (customerId: string, paymentData: { amount: number, type: PaymentType, description: string }) => {
    setCustomers(customers.map(c => {
      if (c.id === customerId) {
        const newHistory = {
          date: new Date().toISOString().split('T')[0],
          amount: paymentData.amount,
          type: paymentData.type,
          description: paymentData.description
        };
        return {
          ...c,
          balance: c.balance - paymentData.amount, // Deduct amount from balance
          lastPaymentDate: newHistory.date,
          history: [newHistory, ...c.history]
        };
      }
      return c;
    }));
  };

  const handleDeletePayment = (customerId: string, historyIdx: number) => {
    if (!window.confirm('Are you sure you want to delete this transaction? The balance will be adjusted accordingly.')) return;

    setCustomers(customers.map(c => {
      if (c.id === customerId) {
        const paymentToDelete = c.history[historyIdx];
        const newHistory = [...c.history];
        newHistory.splice(historyIdx, 1);
        
        return {
          ...c,
          balance: c.balance + paymentToDelete.amount, // Revert the deduction
          history: newHistory,
          lastPaymentDate: newHistory.length > 0 ? newHistory[0].date : c.lastPaymentDate
        };
      }
      return c;
    }));
  };

  const handleEditPayment = (customerId: string, historyIdx: number, updatedData: { amount: number, type: PaymentType, description: string }) => {
    setCustomers(customers.map(c => {
      if (c.id === customerId) {
        const oldPayment = c.history[historyIdx];
        const newHistory = [...c.history];
        
        const updatedRecord = {
          ...oldPayment,
          amount: updatedData.amount,
          type: updatedData.type,
          description: updatedData.description
        };
        
        newHistory[historyIdx] = updatedRecord;

        return {
          ...c,
          // Revert old amount, apply new amount
          balance: c.balance + oldPayment.amount - updatedData.amount,
          history: newHistory
        };
      }
      return c;
    }));
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const SidebarItem = ({ id, icon: Icon, label }: { id: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => setView(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
        view === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  const MobileTabItem = ({ id, icon: Icon, label }: { id: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => setView(id)}
      className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${
        view === id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon className={`w-6 h-6 mb-1 ${view === id ? 'fill-current' : ''}`} />
      <span className="text-[10px] font-bold tracking-wide">{label}</span>
      {view === id && <span className="w-1 h-1 bg-indigo-600 rounded-full mt-1"></span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans pb-24 lg:pb-0">
      
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:block sticky top-0 h-screen w-72 bg-white border-r border-slate-100 shadow-sm z-50">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              K
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-lg leading-tight">{user.companyName}</h1>
              <p className="text-xs text-slate-400 truncate w-40">{user.address}</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            <SidebarItem id="DASHBOARD" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem id="INVENTORY" icon={Car} label="Inventory" />
            <SidebarItem id="CUSTOMERS" icon={Users} label="Customers" />
            <div className="pt-4 mt-4 border-t border-slate-100">
               <SidebarItem id="SETTINGS" icon={Settings} label="Settings" />
            </div>
          </nav>

          <div className="mt-auto pt-4">
             <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 font-medium hover:bg-rose-50 rounded-xl transition-colors mb-4"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
              <div className="text-center px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Created By</p>
                  <p className="text-xs font-bold text-slate-700">Dinesh Kumar</p>
              </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white/90 backdrop-blur-md border-b border-slate-100 p-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">K</div>
            <div>
              <h1 className="font-bold text-slate-800 text-sm leading-tight">{user.companyName}</h1>
              <p className="text-[10px] text-slate-500">{user.address}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {view === 'DASHBOARD' && (
             <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-white/20 p-2 rounded-lg"><Car className="w-6 h-6" /></div>
                            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Total</span>
                        </div>
                        <p className="text-slate-100 text-sm mb-1">Stock In Hand</p>
                        <h3 className="text-3xl font-black">{inventory.length} Units</h3>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-200">
                         <div className="flex justify-between items-start mb-4">
                            <div className="bg-white/20 p-2 rounded-lg"><Users className="w-6 h-6" /></div>
                            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Active</span>
                        </div>
                        <p className="text-slate-100 text-sm mb-1">Total Customers</p>
                        <h3 className="text-3xl font-black">{customers.length}</h3>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-white/20 p-2 rounded-lg"><Wallet className="w-6 h-6" /></div>
                            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Due</span>
                        </div>
                        <p className="text-slate-100 text-sm mb-1">Total Receivables</p>
                        <h3 className="text-3xl font-black">₹ 60,000</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4">Recent Inventory</h3>
                        <Inventory items={inventory.slice(0, 3)} onAdd={handleAddInventory} onDelete={handleDeleteInventory} />
                    </div>
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4">Top Defaulters</h3>
                        <CustomerLedger 
                          customers={customers.filter(c => c.balance > 0).slice(0,3)} 
                          inventory={inventory} 
                          onAdd={handleAddCustomer}
                          onDelete={handleDeleteCustomer}
                          onAddPayment={handleAddPayment} 
                          onDeletePayment={handleDeletePayment}
                          onEditPayment={handleEditPayment}
                        />
                    </div>
                </div>
             </div>
          )}

          {view === 'INVENTORY' && <Inventory items={inventory} onAdd={handleAddInventory} onDelete={handleDeleteInventory} />}
          
          {view === 'CUSTOMERS' && (
            <CustomerLedger 
              customers={customers} 
              inventory={inventory} 
              onAdd={handleAddCustomer} 
              onDelete={handleDeleteCustomer}
              onAddPayment={handleAddPayment}
              onDeletePayment={handleDeletePayment}
              onEditPayment={handleEditPayment}
            />
          )}
          
          {view === 'SETTINGS' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center py-20 animate-fadeIn">
                <Settings className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800">Settings</h3>
                <p className="text-slate-500 mb-10">Configure your Khata Book preferences here.</p>
                
                <div className="max-w-xs mx-auto bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                   <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">App Creator</p>
                   <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Dinesh Kumar</p>
                   <p className="text-[10px] text-slate-400 mt-2 font-medium">© {new Date().getFullYear()} All Rights Reserved</p>
                </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 lg:hidden flex justify-between px-6 py-2 pb-5 z-40 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
        <MobileTabItem id="DASHBOARD" icon={LayoutDashboard} label="Home" />
        <MobileTabItem id="INVENTORY" icon={Car} label="Stock" />
        <MobileTabItem id="CUSTOMERS" icon={Users} label="Khata" />
        <MobileTabItem id="SETTINGS" icon={Settings} label="Menu" />
      </nav>

      <Assistant inventory={inventory} customers={customers} />
    </div>
  );
};

export default App;