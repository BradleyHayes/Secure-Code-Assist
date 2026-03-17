
import React from 'react';
import { ShieldCheck, Files, History, Settings, Lock, HelpCircle, Info, Database, BrainCircuit, MessageSquare, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { AdvisorChat } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenHelp: () => void;
  onOpenAbout: () => void;
  onOpenVault: () => void;
  chats: AdvisorChat[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenHelp, 
  onOpenAbout, 
  onOpenVault,
  chats,
  currentChatId,
  onSelectChat,
  onDeleteChat
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', icon: Files, label: 'Workspace' },
    { id: 'advisor', icon: BrainCircuit, label: 'AI Advisor' },
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
          <h1 className="font-bold text-lg tracking-tight text-white">Secure Code Assist</h1>
          <p className="text-[10px] text-teal-100 font-bold uppercase tracking-widest">Privacy Guard</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
        <h3 className="px-4 text-[9px] font-bold text-teal-200 uppercase tracking-widest mb-2">Main Navigation</h3>
        {menuItems.map((item) => (
          <div key={item.id} className="space-y-1">
            <button
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id 
                  ? 'bg-white/20 text-white font-semibold shadow-inner' 
                  : 'text-teal-100 hover:bg-teal-600 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
            
            {item.id === 'advisor' && (
              <div className="pl-4 space-y-1">
                <button 
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold text-teal-200 hover:text-white uppercase tracking-widest transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <History className="w-3 h-3" /> Chat History
                  </span>
                  {isHistoryOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
                
                {isHistoryOpen && (
                  <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                    {chats.length === 0 ? (
                      <p className="px-4 py-2 text-[10px] text-teal-300 italic">No history yet</p>
                    ) : (
                      chats.map(chat => (
                        <div key={chat.id} className="group flex items-center gap-1">
                          <button
                            onClick={() => {
                              onSelectChat(chat.id);
                              setActiveTab('advisor');
                            }}
                            className={`flex-1 text-left px-4 py-2 rounded-md text-[10px] truncate transition-all ${
                              currentChatId === chat.id 
                                ? 'bg-teal-800 text-white font-bold' 
                                : 'text-teal-200 hover:bg-teal-600 hover:text-white'
                            }`}
                          >
                            {chat.title}
                          </button>
                          <button 
                            onClick={() => onDeleteChat(chat.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-teal-300 hover:text-orange-300 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
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
