import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react';
import { cn } from './utils';

type NotificationType = 'success' | 'error' | 'info' | 'loading';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
}

interface NotificationContextType {
  notify: (type: NotificationType, title: string, message?: string) => string;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback((type: NotificationType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, title, message }]);

    if (type !== 'loading') {
      setTimeout(() => dismiss(id), 5000);
    }

    return id;
  }, [dismiss]);

  return (
    <NotificationContext.Provider value={{ notify, dismiss }}>
      {children}
      <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 w-80 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={cn(
                "pointer-events-auto p-4 rounded-2xl shadow-2xl border flex gap-3 items-start",
                n.type === 'success' ? "bg-white border-emerald-100" :
                n.type === 'error' ? "bg-white border-red-100" :
                n.type === 'loading' ? "bg-white border-blue-100" :
                "bg-white border-slate-100"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl flex-shrink-0",
                n.type === 'success' ? "bg-emerald-50 text-emerald-600" :
                n.type === 'error' ? "bg-red-50 text-red-600" :
                n.type === 'loading' ? "bg-blue-50 text-blue-600" :
                "bg-slate-50 text-slate-600"
              )}>
                {n.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                {n.type === 'error' && <AlertCircle className="w-5 h-5" />}
                {n.type === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
                {n.type === 'info' && <Info className="w-5 h-5" />}
              </div>
              
              <div className="flex-1 pt-1">
                <div className="text-sm font-bold text-slate-900">{n.title}</div>
                {n.message && <div className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</div>}
              </div>

              <button 
                onClick={() => dismiss(n.id)}
                className="p-1 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-300" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
