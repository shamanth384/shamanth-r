import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';
import { useNotification } from '../lib/NotificationCenter';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'model';
  text: string;
}

export function AIAssistant() {
  const { notify } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your AI Credit Risk Assistant. How can I help you understand credit health or the data insights today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, { role: 'user', text: userMessage }].map(m => m.text).join('\n'),
        config: {
          systemInstruction: "You are the RiskPulse AI Assistant, a specialist in credit risk analysis and personal finance. " +
            "You help users understand credit scores, income-to-debt ratios, and how to use this application. " +
            "Keep responses helpful, professional, and concise. If asked about the app, explain that RiskPulse provides " +
            "deep data insights and risk auditing features.",
        },
      });

      const modelResponse = response.text || "I'm sorry, I couldn't generate a response. Please try again.";
      setMessages(prev => [...prev, { role: 'model', text: modelResponse }]);
    } catch (error: any) {
      console.error('Gemini Error:', error);
      const errorMsg = error.message?.includes('API key') 
        ? "API configuration error. Please notify the administrator."
        : "Sorry, I encountered an error. Please check your connection.";
      
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
      notify('error', 'AI Assistant Error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 w-[400px] max-w-[90vw] h-[600px] max-h-[80vh] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="font-bold">RiskPulse AI</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online & Ready
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.role === 'model' && <Bot className="w-3 h-3 text-blue-600" />}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {msg.role === 'model' ? 'Assistant' : 'You'}
                    </span>
                    {msg.role === 'user' && <User className="w-3 h-3 text-slate-400" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex flex-col items-start max-w-[85%]">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="w-3 h-3 text-blue-600" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assistant is thinking...</span>
                  </div>
                  <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-slate-400 italic text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing credit risk patterns...
                  </div>
                </div>
              )}
            </div>

            {/* Input Box */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center"
              >
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about credit risk..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-blue-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <Sparkles className="w-3 h-3 text-blue-400" />
                Powered by RiskPulse Gemini Intelligence
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 group relative",
          isOpen ? "bg-slate-900 rotate-180" : "bg-blue-600"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-50 animate-bounce" />
          </>
        )}
      </motion.button>
    </div>
  );
}
