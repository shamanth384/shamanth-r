import React, { useState } from 'react';
import { Mail, Linkedin, Github, ShieldAlert, Loader2, Send } from 'lucide-react';
import { useNotification } from '../lib/NotificationCenter';

export default function Contact() {
  const { notify } = useNotification();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      notify('success', 'Message Sent', 'Thank you for reaching out. A lead analyst will contact you shortly.');
    }, 1500);
  };

  return (
    <footer id="contact" className="bg-white py-32 min-h-[80vh] flex items-center border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <ShieldAlert className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-2xl tracking-tight">RiskPulse</span>
            </div>
            <p className="text-slate-500 max-w-sm mb-12">
              Advancing the frontier of financial analytics through rigorous EDA and modern design. Built with React and Lucide.
            </p>
            <div className="flex gap-6">
              {[Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200">
            <h3 className="text-2xl font-bold mb-8">Let's connect</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="Name" className="w-full bg-white border border-slate-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                <input required type="email" placeholder="Email" className="w-full bg-white border border-slate-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <textarea required placeholder="Message" rows={4} className="w-full bg-white border border-slate-200 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <button 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
          © 2026 Credit Risk Analysis Project. Designed for Insight.
        </div>
      </div>
    </footer>
  );
}
