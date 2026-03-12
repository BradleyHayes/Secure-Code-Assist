
import React from 'react';
import { X, Book, Rocket, Code2, ShieldCheck, ListChecks, FileText, Settings, HelpCircle, ExternalLink, BrainCircuit, Printer, Copy, CheckCircle, Home, Files } from 'lucide-react';
import { AIAdvisorResponse, CodeFile } from '../types';

interface HelpPortalProps {
  isOpen: boolean;
  onClose: () => void;
  advisorData?: AIAdvisorResponse | null;
  onApplyRedactions: () => void;
  files: CodeFile[];
  onSelectFile: (id: string) => void;
}

const HelpPortal: React.FC<HelpPortalProps> = ({ isOpen, onClose, advisorData, onApplyRedactions, files, onSelectFile }) => {
  if (!isOpen) return null;

  const handleCopyReport = () => {
    if (advisorData?.report) {
      navigator.clipboard.writeText(advisorData.report);
      alert("Report copied to clipboard!");
    }
  };

  const handleDownloadReport = () => {
    if (advisorData?.report) {
      const element = document.createElement("a");
      const file = new Blob([advisorData.report], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "Sentinel_Advisor_Report.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#0f172a] flex flex-col">
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          {advisorData ? (
            <BrainCircuit className="w-6 h-6 text-indigo-400 animate-pulse" />
          ) : (
            <HelpCircle className="w-6 h-6 text-indigo-400" />
          )}
          <h1 className="text-lg font-bold">{advisorData ? 'Sentinel Advisor: QA Review' : 'Sentinel Knowledge Base'}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.open(window.location.href, '_blank')}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-lg"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in New Window
          </button>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* ASIDE NAVIGATION */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/30 p-6 flex flex-col gap-8 shrink-0">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation</h3>
            <button 
              onClick={onClose}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm"
            >
              <Home className="w-4 h-4" /> Home Workspace
            </button>
          </div>

          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Redacted Outputs</h3>
            <div className="space-y-1 overflow-y-auto custom-scrollbar pr-2">
              {files.filter(f => f.status === 'cleaned').map(f => (
                <button 
                  key={f.id}
                  onClick={() => onSelectFile(f.id)}
                  className="w-full text-left px-4 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-indigo-400 truncate"
                >
                  {f.name}
                </button>
              ))}
              {files.filter(f => f.status === 'cleaned').length === 0 && (
                <p className="text-[10px] text-slate-600 italic px-4">No cleaned files yet.</p>
              )}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent">
          <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
            
            {/* AI ADVISOR REPORT */}
            {advisorData && (
              <section className="bg-indigo-600/10 border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-indigo-500/20 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <BrainCircuit className="w-6 h-6 text-indigo-400" />
                    <h2 className="text-2xl font-bold text-white">IT Advisor & QA Report</h2>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCopyReport} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors" title="Copy Text">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={() => window.print()} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors" title="Print to PDF">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-8 space-y-8">
                  <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {advisorData.report}
                  </div>

                  {advisorData.recommendations.length > 0 && (
                    <div className="pt-8 border-t border-indigo-500/20">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-5 h-5 text-emerald-400" />
                          <h3 className="text-lg font-bold text-white">Recommended Additional Redactions</h3>
                        </div>
                        <button 
                          onClick={onApplyRedactions}
                          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-600/20"
                        >
                          <CheckCircle className="w-4 h-4" /> Complete Recommended Redactions
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {advisorData.recommendations.map((rec, idx) => (
                          <div key={idx} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-mono text-indigo-400 font-bold">{rec.originalText}</span>
                              <span className="text-[10px] text-slate-500">{rec.reason}</span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-bold">
                              {rec.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Section: C# SOURCE CODE DELIVERABLES */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold">Executable Engine Deliverables (C#)</h2>
              </div>
              
              <div className="space-y-4">
                 <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="bg-slate-800 px-4 py-2 flex justify-between items-center">
                      <span className="text-xs font-mono text-slate-400">DeterministicScanner.cs</span>
                    </div>
                    <pre className="p-6 text-xs text-indigo-300 overflow-x-auto font-mono">
{`using System.Text.RegularExpressions;
using System.Collections.Generic;

public class DeterministicScanner {
    public static string Clean(string input, out Dictionary<string, string> map) {
        map = new Dictionary<string, string>();
        string output = input;

        var rules = new[] {
            new { Type = "URL", Regex = @"(https?://[^\s""'<>]+)|(\b[a-z0-9.-]+\.local\b)" },
            new { Type = "SECRET", Regex = @"(\b(password|secret|key|token|jwt|api|client|db|auth|internal|private)[a-z0-9_-]*\s*[:=]\s*[""']([^""']+)[""'])" },
            new { Type = "COMPANY", Regex = @"(\bBrad Onsite Medical\b|\bBOM\b)" },
            new { Type = "LITERAL", Regex = @"[""']([a-zA-Z0-9]{16,})[""']" }
        };

        foreach (var rule in rules) {
            output = Regex.Replace(output, rule.Regex, m => {
                string val = m.Groups.Count > 3 ? m.Groups[3].Value : (m.Groups.Count > 1 ? m.Groups[1].Value : m.Value);
                if (string.IsNullOrEmpty(val)) val = m.Value;

                if (!map.ContainsValue(val)) {
                    string token = $"__REDACTED_{rule.Type}_{map.Count:D3}__";
                    map[token] = val;
                }
                
                string existingToken = "";
                foreach(var kv in map) if(kv.Value == val) existingToken = kv.Key;

                return m.Value.Replace(val, existingToken);
            }, RegexOptions.IgnoreCase);
        }
        return output;
    }
}`}
                    </pre>
                 </div>
              </div>
            </section>

            <footer className="pt-12 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-600 italic">
                Developed by Bradley Hayes • Senior IT Analyst & AI Engineer • APSU
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPortal;
