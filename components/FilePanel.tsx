
import React from 'react';
import { CodeFile } from '../types';
import { FileCode, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface FilePanelProps {
  files: CodeFile[];
  selectedFileId: string | null;
  onSelectFile: (id: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilePanel: React.FC<FilePanelProps> = ({ files, selectedFileId, onSelectFile, onFileUpload }) => {
  return (
    <div className="w-80 border-r border-orange-100 bg-teal-50/10 flex flex-col">
      <div className="p-4 border-b border-orange-100 flex justify-between items-center bg-white">
        <h2 className="text-sm font-semibold text-teal-600 uppercase tracking-wider">Source Files</h2>
        <label className="cursor-pointer bg-teal-600 hover:bg-teal-500 px-3 py-1 rounded text-xs text-white font-bold transition-colors">
          Add
          <input type="file" multiple className="hidden" onChange={onFileUpload} />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto">
        {files.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            <FileCode className="w-12 h-12 mx-auto mb-3 opacity-20" />
            No files imported.
          </div>
        ) : (
          files.map((file) => (
            <button
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className={`w-full text-left p-4 border-b border-orange-50 transition-colors group relative ${
                selectedFileId === file.id ? 'bg-teal-50 border-l-4 border-l-teal-600' : 'hover:bg-teal-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium truncate pr-4 ${selectedFileId === file.id ? 'text-teal-700' : 'text-slate-600'}`}>
                  {file.name}
                </span>
                {file.status === 'analyzing' && <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />}
                {file.status === 'cleaned' && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                {file.status === 'error' && <AlertCircle className="w-4 h-4 text-rose-500" />}
              </div>
              <div className="text-[10px] text-slate-400 truncate font-mono">
                {file.path}
              </div>
              {file.findings.length > 0 && (
                <div className="mt-2 flex gap-1">
                  <span className="bg-rose-50 text-rose-600 text-[10px] px-1.5 py-0.5 rounded border border-rose-100">
                    {file.findings.length} risks
                  </span>
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default FilePanel;
