
import React from 'react';
import { CodeFile } from '../types';
import { Zap, RotateCcw, ShieldAlert, Check } from 'lucide-react';

interface CodeViewerProps {
  file: CodeFile;
  onClean: (id: string) => void;
  onUndo: (id: string) => void;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ file, onClean, onUndo }) => {
  const isCleaned = file.status === 'cleaned';

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-200">{file.name}</span>
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
            file.status === 'pending' ? 'bg-slate-700 text-slate-400' :
            file.status === 'analyzing' ? 'bg-indigo-500/20 text-indigo-400 animate-pulse' :
            file.status === 'cleaned' ? 'bg-emerald-500/20 text-emerald-400' :
            'bg-rose-500/20 text-rose-400'
          }`}>
            {file.status}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {isCleaned ? (
            <button
              onClick={() => onUndo(file.id)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium px-4 py-2 rounded-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Undo Changes
            </button>
          ) : (
            <button
              disabled={file.status === 'analyzing'}
              onClick={() => onClean(file.id)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2 rounded-lg transition-all shadow-lg shadow-indigo-600/20"
            >
              <Zap className="w-4 h-4" />
              Run ML Analysis
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Original Code */}
        <div className="flex flex-col border-r border-slate-800">
          <div className="bg-slate-800/30 px-4 py-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest border-b border-slate-800">
            Raw Source (Read Only)
          </div>
          <div className="flex-1 overflow-auto bg-[#0d1117] p-6 code-font text-sm leading-relaxed whitespace-pre relative">
            {file.originalContent}
            {file.findings.map(f => (
              <div 
                key={f.id} 
                className={`absolute left-0 w-full opacity-20 pointer-events-none border-y ${
                  f.severity === 'high' ? 'bg-rose-500 border-rose-500' : 
                  f.severity === 'medium' ? 'bg-amber-500 border-amber-500' : 'bg-blue-500 border-blue-500'
                }`}
                style={{ top: `${(f.lineNumber - 1) * 1.5}rem`, height: '1.5rem' }}
              />
            ))}
          </div>
        </div>

        {/* Cleaned Code */}
        <div className="flex flex-col bg-slate-900">
          <div className="bg-emerald-500/5 px-4 py-2 text-[10px] text-emerald-500 font-bold uppercase tracking-widest border-b border-emerald-500/20 flex justify-between items-center">
            <span>Redacted Version</span>
            {isCleaned && <div className="flex items-center gap-1 text-[9px]"><Check className="w-3 h-3" /> SAFE FOR AI</div>}
          </div>
          <div className="flex-1 overflow-auto bg-[#0d1117] p-6 code-font text-sm leading-relaxed text-slate-300 whitespace-pre">
            {file.cleanedContent || (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
                <p>Run analysis to generate a safe version.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Findings Footer */}
      {file.findings.length > 0 && (
        <div className="h-64 border-t border-slate-800 bg-slate-900 overflow-y-auto">
          <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Analysis Report</h3>
            <span className="text-[10px] text-slate-400 italic">Local Deep Learning Engine v2.4.1</span>
          </div>
          <div className="divide-y divide-slate-800">
            {file.findings.map(finding => (
              <div key={finding.id} className="p-4 flex items-start gap-4 hover:bg-slate-800/50 transition-colors">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  finding.severity === 'high' ? 'bg-rose-500 animate-pulse' :
                  finding.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200">
                      Line {finding.lineNumber}: <span className="text-indigo-400 font-mono">{finding.originalText}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {finding.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{finding.explanation}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">Replacement:</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                      {finding.suggestedReplacement}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeViewer;
