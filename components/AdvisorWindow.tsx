
import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Send, Mic, Paperclip, Trash2, MessageSquare, ChevronDown, FileText, Download, Copy, CheckCircle } from 'lucide-react';
import { AdvisorChat, Message, TokenMapping } from '../types';
import Markdown from 'react-markdown';

interface AdvisorWindowProps {
  chats: AdvisorChat[];
  currentChatId: string | null;
  onSendMessage: (content: string, attachments?: { name: string; content: string }[]) => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  isProcessing: boolean;
  onFileUpload: (file: File) => void;
}

const AdvisorWindow: React.FC<AdvisorWindowProps> = ({
  chats,
  currentChatId,
  onSendMessage,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isProcessing,
  onFileUpload
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentChat = chats.find(c => c.id === currentChatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real app, we'd use the Web Speech API here
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInput(prev => prev + (prev ? ' ' : '') + "This is a simulated voice-to-text input.");
      }, 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-sky-50 overflow-hidden">
      <header className="h-16 border-b border-orange-200 bg-white px-8 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">AI Advisor Interactive</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Senior QA & IT Strategy</p>
          </div>
        </div>
        <button 
          onClick={onNewChat}
          className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" /> New Session
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white/50">
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {!currentChat || currentChat.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
                <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center">
                  <BrainCircuit className="w-10 h-10 text-teal-200" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-800">How can I assist your security audit?</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    I can review redacted code, suggest architectural improvements, or help you plan your QA strategy. Upload files to automatically process them with the restore engine.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button onClick={() => setInput("Review my latest redaction report")} className="p-3 bg-white border border-orange-100 rounded-xl text-xs text-slate-600 hover:border-teal-400 transition-all text-left">
                    "Review my latest redaction report"
                  </button>
                  <button onClick={() => setInput("Suggest a QA test plan for this module")} className="p-3 bg-white border border-orange-100 rounded-xl text-xs text-slate-600 hover:border-teal-400 transition-all text-left">
                    "Suggest a QA test plan for this module"
                  </button>
                </div>
              </div>
            ) : (
              currentChat.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter ${msg.role === 'user' ? 'text-teal-600' : 'text-orange-500'}`}>
                      {msg.role === 'user' ? 'You' : 'AI Advisor'}
                      <span className="text-slate-400 font-normal">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={`p-4 rounded-2xl shadow-sm border ${
                      msg.role === 'user' 
                        ? 'bg-teal-600 text-white border-teal-500 rounded-tr-none' 
                        : 'bg-white text-slate-700 border-orange-100 rounded-tl-none'
                    }`}>
                      <div className="prose prose-sm max-w-none prose-slate">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                          {msg.attachments.map((att, i) => (
                            <div key={i} className="flex items-center gap-2 bg-black/10 p-2 rounded-lg text-xs">
                              <FileText className="w-3 h-3" />
                              <span className="truncate">{att.name}</span>
                              <span className="ml-auto text-[10px] opacity-50">Processed</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white border border-orange-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Advisor is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-orange-100">
            <div className="max-w-4xl mx-auto relative">
              <div className="flex items-end gap-3 bg-sky-50 border border-orange-200 rounded-2xl p-2 focus-within:border-teal-400 transition-all shadow-inner">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-slate-400 hover:text-teal-600 transition-colors"
                  title="Import File (Auto-Restore)"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".txt,.java,.cs,.tsk,.py,.sh,.bat"
                />
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask the Advisor anything..."
                  className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-sm text-slate-700 resize-none max-h-40 custom-scrollbar"
                />
                <button 
                  onClick={toggleListening}
                  className={`p-3 transition-colors ${isListening ? 'text-orange-500 animate-pulse' : 'text-slate-400 hover:text-teal-600'}`}
                  title="Voice to Text"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isProcessing}
                  className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-center text-slate-400">
                Uploaded code files are automatically processed by the **Secure Restore Engine**.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorWindow;
