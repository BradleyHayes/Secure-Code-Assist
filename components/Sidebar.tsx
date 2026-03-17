
import React from 'react';
import { ShieldCheck, Files, History, Settings, Lock, HelpCircle, Info, Database } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenHelp: () => void;
  onOpenAbout: () => void;
  onOpenVault: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenHelp, onOpenAbout, onOpenVault }) => {
  const menuItems = [
    { id: 'dashboard', icon: Files, label: 'Workspace' },
    { id: 'audit', icon: History, label: 'Audit Log' },
    { id: 'settings', icon: Settings, label: 'Configuration' },
  ];

  return (
    <div className="w-64 bg-teal-700 border-r border-orange-200 flex flex-col h-screen sticky top-0 text-white">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-orange-400 p-2 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">Secure Code Assist</h1>
          <p className="text-[10px] text-teal-100 font-bold uppercase tracking-widest">Privacy Guard</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        <h3 className="px-4 text-[9px] font-bold text-teal-200 uppercase tracking-widest mb-2">Main Navigation</h3>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id 
                ? 'bg-white/20 text-white font-semibold' 
                : 'text-teal-100 hover:bg-teal-600 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}

        <div className="pt-4 mt-4 border-t border-teal-600/50">
          <h3 className="px-4 text-[9px] font-bold text-teal-200 uppercase tracking-widest mb-2">Data Security</h3>
          <button
            onClick={onOpenVault}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-teal-100 hover:bg-teal-600 hover:text-orange-300 transition-all font-medium"
          >
            <Database className="w-5 h-5" />
            Mapping Registry
          </button>
        </div>
      </nav>

      <div className="px-4 py-4 space-y-2 border-t border-teal-600/50">
        <button
          onClick={onOpenHelp}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-teal-100 hover:bg-teal-600 hover:text-white transition-all text-sm font-medium"
        >
          <HelpCircle className="w-4 h-4" />
          User Guide
        </button>
        <button
          onClick={onOpenAbout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-teal-100 hover:bg-teal-600 hover:text-white transition-all text-sm font-medium"
        >
          <Info className="w-4 h-4" />
          About Developer
        </button>
      </div>

      <div className="p-4 bg-teal-800/30 border-t border-orange-200/30 m-4 rounded-xl border border-orange-200/20">
        <div className="flex items-center gap-2 text-[10px] font-bold text-orange-300 mb-1">
          <Lock className="w-3 h-3" />
          LOCAL PROTECTION
        </div>
        <p className="text-[9px] text-teal-100 leading-relaxed italic">
          Scrubbing logic is executing 100% on-device. No credentials leave this machine.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
