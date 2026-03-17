
import React from 'react';
import { X, Award, BookOpen, MapPin, Shield } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-teal-900/60 backdrop-blur-md p-4">
      <div className="bg-white border border-orange-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-orange-400 to-teal-600"></div>
        
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-teal-600/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Bradley Hayes</h2>
          <p className="text-teal-600 font-semibold mb-6">IT Analyst • AI Engineer</p>
          
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-3 bg-teal-50 p-3 rounded-xl border border-orange-100 text-left">
              <Award className="w-5 h-5 text-orange-500 shrink-0" />
              <span className="text-sm text-slate-700">MSCS Data Analysis</span>
            </div>
            
            <div className="flex items-center gap-3 bg-teal-50 p-3 rounded-xl border border-orange-100 text-left">
              <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
              <span className="text-sm text-slate-700">Austin Peay State University</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-orange-100 w-full">
            <p className="text-xs text-slate-500 leading-relaxed italic">
              Specializing in secure local-first AI architectures and high-fidelity code redaction systems.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="mt-8 w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-bold transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
