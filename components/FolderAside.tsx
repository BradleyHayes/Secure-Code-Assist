
import React, { useState } from 'react';
import { Folder, FolderPlus, Trash2, Edit2, ChevronRight, ChevronDown, FileCode, Plus } from 'lucide-react';
import { Folder as FolderType, CodeFile } from '../types';

interface FolderAsideProps {
  folders: FolderType[];
  files: CodeFile[];
  selectedFileId: string | null;
  onSelectFile: (id: string) => void;
  onAddFolder: (parentId: string | null) => void;
  onDeleteFolder: (id: string) => void;
  onRenameFolder: (id: string, name: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, folderId: string) => void;
}

const FolderAside: React.FC<FolderAsideProps> = ({ 
  folders, files, selectedFileId, onSelectFile, onAddFolder, onDeleteFolder, onRenameFolder, onFileUpload 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const renderFolder = (parentId: string | null, depth = 0) => {
    return folders
      .filter(f => f.parentId === parentId)
      .map(folder => (
        <div key={folder.id} className="select-none">
          <div 
            className="group flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800 rounded-md cursor-pointer transition-colors"
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
          >
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            <Folder className="w-4 h-4 text-indigo-400" />
            {editingId === folder.id ? (
              <input
                autoFocus
                className="bg-slate-900 text-xs text-slate-200 border border-indigo-500 rounded px-1 outline-none w-24"
                defaultValue={folder.name}
                onBlur={(e) => {
                  onRenameFolder(folder.id, e.target.value);
                  setEditingId(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
              />
            ) : (
              <span className="text-xs font-medium text-slate-300 truncate flex-1">{folder.name}</span>
            )}
            
            <div className="hidden group-hover:flex items-center gap-1">
              <button onClick={() => setEditingId(folder.id)} className="p-1 hover:text-indigo-400"><Edit2 className="w-3 h-3" /></button>
              <button onClick={() => onAddFolder(folder.id)} className="p-1 hover:text-indigo-400"><Plus className="w-3 h-3" /></button>
              {folder.parentId !== null && (
                <button onClick={() => onDeleteFolder(folder.id)} className="p-1 hover:text-rose-400"><Trash2 className="w-3 h-3" /></button>
              )}
            </div>
          </div>
          
          <div className="mt-0.5">
            {/* Render files in this folder */}
            {files.filter(f => f.folderId === folder.id).map(file => (
              <div 
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-md text-[11px] transition-colors ${
                  selectedFileId === file.id ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                }`}
                style={{ paddingLeft: `${(depth + 1) * 12 + 16}px` }}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span className="truncate">{file.name}</span>
              </div>
            ))}
            {/* Render subfolders */}
            {renderFolder(folder.id, depth + 1)}
          </div>
        </div>
      ));
  };

  return (
    <div className="w-64 border-r border-slate-800 bg-slate-900/40 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Explorer</h2>
        <button 
          onClick={() => onAddFolder(null)}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-400"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
        {renderFolder(null)}
      </div>
    </div>
  );
};

export default FolderAside;
