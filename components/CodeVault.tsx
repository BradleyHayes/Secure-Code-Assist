
import React from 'react';
import { X, FileText, Download, Printer, Database } from 'lucide-react';
import { TokenMapping } from '../types';

interface CodeVaultProps {
  isOpen: boolean;
  onClose: () => void;
  mappings: TokenMapping[];
}

const CodeVault: React.FC<CodeVaultProps> = ({ isOpen, onClose, mappings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-teal-900/60 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white border border-orange-200 w-full max-w-4xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <header className="p-6 border-b border-orange-100 flex justify-between items-center bg-teal-50/50">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-800">Redaction Mapping Registry (Local Vault)</h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.print()}
              className="p-2 hover:bg-teal-100 rounded-lg text-teal-700 transition-colors flex items-center gap-2 text-xs font-bold"
            >
              <Printer className="w-4 h-4" /> Print Registry
            </button>
            <button onClick={onClose} className="p-2 hover:bg-teal-100 rounded-full transition-colors text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          <div className="mb-6 p-4 bg-teal-50 border border-orange-100 rounded-xl">
            <p className="text-xs text-teal-700 leading-relaxed italic">
              This registry tracks every sensitive value encountered. The Local-LLM ensures that if the same value appears in multiple files, it is replaced by the exact same unique token, ensuring logic consistency for external AI processing.
            </p>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-orange-100 text-[10px] text-teal-600 font-bold uppercase tracking-widest">
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Unique Token (Code)</th>
                <th className="py-3 px-4">Original Value (HIDDEN)</th>
                <th className="py-3 px-4">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {mappings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 italic text-sm">
                    No redactions have been performed yet.
                  </td>
                </tr>
              ) : (
                mappings.map((m, idx) => (
                  <tr key={idx} className="hover:bg-teal-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-teal-100 text-teal-700 border border-teal-200 font-bold">
                        {m.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-teal-600 font-bold">
                      {m.token}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-slate-400">
                      ●●●●●●●●●●
                    </td>
                    <td className="py-4 px-4 text-[10px] text-slate-500">
                      {new Date(m.firstSeen).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="p-4 bg-teal-50/50 border-t border-orange-100 flex justify-between items-center">
          <p className="text-[10px] text-slate-500">Total Persistent Tokens: {mappings.length}</p>
          <p className="text-[10px] text-slate-500 italic">Bradley Hayes Core v1.2</p>
        </footer>
      </div>
    </div>
  );
};

export default CodeVault;
