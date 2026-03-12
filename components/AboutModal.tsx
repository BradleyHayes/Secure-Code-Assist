
import React from 'react';
import { X, Award, BookOpen, MapPin, Shield } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
        
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-600/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-1">Bradley Hayes</h2>
          <p className="text-indigo-400 font-semibold mb-6">IT Analyst • AI Engineer</p>
          
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-left">
              <Award className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="text-sm text-slate-300">MSCS Data Analysis</span>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-left">
              <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
              <span className="text-sm text-slate-300">Austin Peay State University</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 w-full">
            <p className="text-xs text-slate-500 leading-relaxed italic">
              Specializing in secure local-first AI architectures and high-fidelity code redaction systems.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="mt-8 w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
