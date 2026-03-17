
import React, { useState } from 'react';
import { X, Upload, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { CodeFile } from '../types';

interface RestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (fileId: string, modifiedContent: string) => void;
  availableFiles: CodeFile[];
}

const RestoreModal: React.FC<RestoreModalProps> = ({ isOpen, onClose, onRestore, availableFiles }) => {
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [modifiedContent, setModifiedContent] = useState<string>('');
  const [importedFileName, setImportedFileName] = useState<string>('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setModifiedContent(event.target?.result as string);
        setImportedFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const canSubmit = selectedFileId && modifiedContent;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-teal-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border border-orange-200 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-orange-100 flex justify-between items-center bg-teal-50/30">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
            Restore Script
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-teal-100 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <p className="text-sm text-slate-500 leading-relaxed">
            Re-inject original private data into a script that has been modified externally by AI services.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-teal-600 uppercase tracking-wider">1. Select Original Reference</label>
              <select 
                className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-teal-500 transition-colors"
                value={selectedFileId}
                onChange={(e) => setSelectedFileId(e.target.value)}
              >
                <option value="">Select a file to match metadata...</option>
                {availableFiles.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.findings.length} markers)</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-teal-600 uppercase tracking-wider">2. Import Modified File</label>
              <label className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                modifiedContent ? 'border-teal-500/50 bg-teal-50' : 'border-orange-200 hover:border-teal-300 bg-teal-50/20'
              }`}>
                <input type="file" className="hidden" onChange={handleFileUpload} />
                <div className="flex flex-col items-center gap-2">
                  <Upload className={`w-8 h-8 ${modifiedContent ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span className="text-sm font-medium text-slate-600">
                    {importedFileName || 'Click to upload AI-modified file'}
                  </span>
                  {modifiedContent && <span className="text-[10px] text-teal-600 font-bold">FILE CAPTURED</span>}
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 bg-teal-50/30 border-t border-orange-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-teal-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!canSubmit}
            onClick={() => onRestore(selectedFileId, modifiedContent)}
            className="px-8 py-2.5 rounded-xl text-sm font-bold bg-teal-600 hover:bg-teal-500 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all shadow-lg shadow-teal-600/20"
          >
            Restore & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreModal;
