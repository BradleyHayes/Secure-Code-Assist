
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FolderAside from './components/FolderAside';
import RestoreModal from './components/RestoreModal';
import AboutModal from './components/AboutModal';
import HelpPortal from './components/HelpPortal';
import CodeVault from './components/CodeVault';
import { CodeFile, Finding, Folder, RiskType, TokenMapping, AIAdvisorResponse, AIRecommendation } from './types';
import { performAIReviewAndAdvice } from './services/geminiService';
import { Layout, ShieldAlert, Zap, RotateCcw, RefreshCw, Upload, FileText, BrainCircuit, Save } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'input', name: 'input', parentId: null },
    { id: 'cleaned', name: 'cleaned', parentId: null },
    { id: 'updated', name: 'updated', parentId: null },
  ]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isHelpPortalOpen, setIsHelpPortalOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [advisorData, setAdvisorData] = useState<AIAdvisorResponse | null>(null);
  const [tokenRegistry, setTokenRegistry] = useState<TokenMapping[]>([]);

  // Local storage for checkpoint (Persistence simulation)
  useEffect(() => {
    const saved = localStorage.getItem('sentinel_checkpoint');
    if (saved) {
      const { files: f, folders: fd, tokens: t } = JSON.parse(saved);
      setFiles(f);
      setFolders(fd);
      setTokenRegistry(t);
    }
  }, []);

  const saveCheckpoint = () => {
    const data = { files, folders, tokens: tokenRegistry };
    localStorage.setItem('sentinel_checkpoint', JSON.stringify(data));
    alert("Checkpoint saved successfully!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, folderId: string = 'input') => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files) as File[];

    const newFiles: CodeFile[] = filesArray.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      path: `C:\\Projects\\Local\\${file.name}`,
      originalContent: '',
      status: 'pending' as const,
      findings: [],
      folderId: folderId
    }));

    newFiles.forEach(nf => {
      const reader = new FileReader();
      const actualFile = filesArray.find(f => f.name === nf.name);
      if (actualFile) {
        reader.onload = (event) => {
          setFiles(prev => prev.map(p => p.id === nf.id ? { ...p, originalContent: event.target?.result as string } : p));
        };
        reader.readAsText(actualFile);
      }
    });

    setFiles(prev => [...prev, ...newFiles]);
    if (!selectedFileId && newFiles.length > 0) setSelectedFileId(newFiles[0].id);
  };

  const handleCodeChange = (newContent: string) => {
    if (!selectedFileId) return;
    setFiles(prev => prev.map(f => {
      if (f.id === selectedFileId) {
        if (f.status === 'cleaned' || f.status === 'restored') {
          return { ...f, cleanedContent: newContent };
        }
        return { ...f, originalContent: newContent };
      }
      return f;
    }));
  };

  const handleCleanCode = async (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;

    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'analyzing' as const } : f));
    setIsProcessing(true);

    try {
      let cleaned = file.originalContent;
      const newTokenMappings: TokenMapping[] = [...tokenRegistry];
      
      const patterns = [
        { type: RiskType.PRIVATE_URL, regex: /(https?:\/\/[^\s"'<>]+)|(\b[a-z0-9.-]+\.local\b)|(\binternal\b|\bintranet\b|\bgateway\b)/gi },
        { type: RiskType.API_SECRET, regex: /(\b(password|secret|key|token|jwt|oauth|auth|api|client|db|internal|private)[a-z0-9_-]*\s*[:=]\s*["']([^"']+)["'])/gi },
        { type: RiskType.COMPANY_NAME, regex: /(\bBrad Onsite Medical\b|\bBOM\b|\bCompany\sName\b|\bProprietary\b)/gi },
        { type: RiskType.API_SECRET, regex: /["']([a-zA-Z0-9!@#$%^&*()_\-+=]{16,})["']/g }
      ];

      patterns.forEach(p => {
        cleaned = cleaned.replace(p.regex, (match, p1, p2, p3) => {
          let valueToRedact = match;
          if (p3) valueToRedact = p3;
          else if (p1 && (match.startsWith('"') || match.startsWith("'"))) valueToRedact = p1;

          let existing = newTokenMappings.find(m => m.originalValue === valueToRedact);
          if (!existing) {
            const count = newTokenMappings.filter(m => m.type === p.type).length + 1;
            const token = `__REDACTED_${p.type}_${String(count).padStart(3, '0')}__`;
            existing = { originalValue: valueToRedact, token, type: p.type, firstSeen: Date.now() };
            newTokenMappings.push(existing);
          }
          return match.replace(valueToRedact, existing.token);
        });
      });

      setTokenRegistry(newTokenMappings);

      const adviceResponse = await performAIReviewAndAdvice(file.name, cleaned);
      setAdvisorData(adviceResponse);
      setIsHelpPortalOpen(true);

      const date = new Date();
      const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
      const newName = `${file.name.split('.')[0]}_cleaned_${formattedDate}.${file.name.split('.')[1] || 'txt'}`;

      const cleanedFile: CodeFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: newName,
        path: `C:\\Projects\\Local\\Cleaned\\${newName}`,
        originalContent: file.originalContent,
        cleanedContent: cleaned,
        status: 'cleaned' as const,
        findings: [],
        lastActionAt: Date.now(),
        folderId: 'cleaned'
      };

      setFiles(prev => [
        ...prev.map(f => f.id === id ? { ...f, status: 'pending' as const } : f),
        cleanedFile
      ]);
      setSelectedFileId(cleanedFile.id);
    } catch (error) {
      console.error(error);
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'error' as const } : f));
    } finally {
      setIsProcessing(false);
    }
  };

  const applyAIRedactions = () => {
    if (!selectedFileId || !advisorData || advisorData.recommendations.length === 0) return;
    
    setFiles(prev => prev.map(f => {
      if (f.id === selectedFileId) {
        let content = f.cleanedContent || f.originalContent;
        const currentTokens = [...tokenRegistry];
        
        advisorData.recommendations.forEach(rec => {
          let existing = currentTokens.find(m => m.originalValue === rec.originalText);
          if (!existing) {
            const count = currentTokens.filter(m => m.type === rec.type).length + 1;
            const token = `__REDACTED_AI_${rec.type}_${String(count).padStart(3, '0')}__`;
            existing = { originalValue: rec.originalText, token, type: rec.type, firstSeen: Date.now() };
            currentTokens.push(existing);
          }
          content = content.split(rec.originalText).join(existing.token);
        });
        
        setTokenRegistry(currentTokens);
        return { ...f, cleanedContent: content, status: 'cleaned' };
      }
      return f;
    }));
    
    setAdvisorData(prev => prev ? { ...prev, recommendations: [] } : null);
    alert("AI Recommendations applied to current workspace!");
  };

  const handleRestoreScript = (fileId: string, modifiedContent: string) => {
    const originalFile = files.find(f => f.id === fileId);
    if (!originalFile) return;
    let restored = modifiedContent;
    tokenRegistry.forEach(mapping => {
      restored = restored.split(mapping.token).join(mapping.originalValue);
    });
    const restoredFileId = Math.random().toString(36).substr(2, 9);
    setFiles(prev => [...prev, {
      id: restoredFileId,
      name: `Restored_${originalFile.name}`,
      path: `C:\\Projects\\Updated\\${originalFile.name}`,
      originalContent: originalFile.originalContent,
      cleanedContent: restored,
      status: 'restored' as const,
      findings: [],
      folderId: 'updated'
    }]);
    setSelectedFileId(restoredFileId);
    setIsRestoreModalOpen(false);
  };

  const selectedFile = files.find(f => f.id === selectedFileId);
  const currentDisplayContent = selectedFile 
    ? (selectedFile.status === 'cleaned' || selectedFile.status === 'restored' 
        ? selectedFile.cleanedContent 
        : selectedFile.originalContent) 
    : '';

  return (
    <div className="flex h-screen bg-sky-50 text-slate-800 selection:bg-teal-500/30 font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenHelp={() => setIsHelpPortalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
      />
      
      {activeTab === 'dashboard' && (
        <FolderAside 
          folders={folders} 
          files={files} 
          selectedFileId={selectedFileId} 
          onSelectFile={setSelectedFileId}
          onAddFolder={() => {}} 
          onDeleteFolder={() => {}} 
          onRenameFolder={() => {}} 
          onFileUpload={handleFileUpload}
        />
      )}

      <main className="flex-1 flex flex-col min-w-0 bg-white/40">
        <header className="h-14 border-b border-orange-200 flex items-center justify-between px-6 bg-teal-600 shrink-0 backdrop-blur-md text-white">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-teal-50 flex items-center gap-2">
              <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin text-orange-300' : ''}`} />
              {isProcessing ? 'Secure Engine Scrubbing...' : 'Secure Engine Ready'}
            </span>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={saveCheckpoint}
               className="text-[10px] text-teal-50 hover:text-white flex items-center gap-2 bg-teal-700 px-3 py-1.5 rounded-lg transition-colors border border-teal-500"
             >
               <Save className="w-3 h-3" /> Save Checkpoint
             </button>
             <div className="text-[10px] text-teal-100 font-mono flex items-center gap-2 bg-teal-800/30 px-3 py-1 rounded-full border border-teal-500">
               <BrainCircuit className="w-3 h-3 text-orange-300" />
               AI ADVISOR: {advisorData ? 'REPORT READY' : 'STANDBY'}
             </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 flex flex-col min-h-0">
             <div className="bg-white border border-orange-200 rounded-xl overflow-hidden flex flex-col shadow-xl flex-1">
                <div className="bg-teal-50 px-4 py-2 border-b border-orange-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-semibold text-slate-600">
                      {selectedFile ? selectedFile.name : 'Secure Workspace'}
                    </span>
                  </div>
                  {selectedFile?.status === 'cleaned' && (
                    <span className="text-[10px] bg-teal-500/10 text-teal-600 px-2 py-0.5 rounded border border-teal-500/20 font-bold">
                      REDACTION COMPLETE
                    </span>
                  )}
                </div>
                <div className="flex-1 relative bg-white">
                  {selectedFile ? (
                    <textarea
                      spellCheck={false}
                      className="w-full h-full p-6 bg-transparent code-font text-sm leading-relaxed text-slate-700 outline-none resize-none custom-scrollbar"
                      value={currentDisplayContent}
                      onChange={(e) => handleCodeChange(e.target.value)}
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 text-center max-w-sm mx-auto">
                      <Layout className="w-16 h-16 opacity-10" />
                      <p className="text-sm">Import source files to begin local sanitization.</p>
                    </div>
                  )}
                </div>
             </div>
          </div>

          <div className="p-6 pt-0 border-t border-orange-100 bg-teal-50/30 shrink-0">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <h3 className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Scanner Controls</h3>
                  <div className="flex gap-3">
                    <button 
                      disabled={!selectedFile || isProcessing || selectedFile.status === 'cleaned' || selectedFile.status === 'restored'}
                      onClick={() => selectedFile && handleCleanCode(selectedFile.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-30 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all shadow-lg"
                    >
                      <Zap className="w-4 h-4" />
                      Secure Clean
                    </button>
                    <button 
                      onClick={() => setIsRestoreModalOpen(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white py-3 rounded-xl font-bold transition-all shadow-lg"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restore Code
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Import Data</h3>
                  <label className="flex-1 border border-dashed border-orange-200 bg-white rounded-xl flex items-center justify-center gap-3 p-3 hover:bg-teal-50 cursor-pointer transition-all">
                    <Upload className="w-5 h-5 text-teal-400" />
                    <span className="text-xs text-slate-500">Drag files for local-only scrubbing</span>
                    <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(e, 'input')} />
                  </label>
                </div>
             </div>
          </div>
        </div>
      </main>

      <RestoreModal isOpen={isRestoreModalOpen} onClose={() => setIsRestoreModalOpen(false)} onRestore={handleRestoreScript} availableFiles={files.filter(f => f.status === 'cleaned')} />
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
      
      <HelpPortal 
        isOpen={isHelpPortalOpen} 
        onClose={() => setIsHelpPortalOpen(false)} 
        advisorData={advisorData} 
        onApplyRedactions={applyAIRedactions}
        files={files}
        onSelectFile={(id) => { setSelectedFileId(id); setIsHelpPortalOpen(false); }}
      />
      
      <CodeVault isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} mappings={tokenRegistry} />
      
      <footer className="h-8 border-t border-orange-200 bg-teal-600 fixed bottom-0 left-0 right-0 z-50 px-4 flex items-center justify-between text-[10px] text-teal-50 font-medium shrink-0">
        <div className="flex gap-4">
           <span>Secure Code Assist - Local Privacy Guard</span>
           <span className="text-orange-200">Bradley Hayes | IT Analyst & AI Engineer</span>
        </div>
        <div className="flex gap-4">
           <span className="text-white uppercase tracking-tighter font-bold">100% Secure Privacy</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
