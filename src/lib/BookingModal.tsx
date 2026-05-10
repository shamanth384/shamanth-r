import React, { useState } from 'react';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, CheckCircle2, Loader2, MessageSquare } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationCenter';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [topic, setTopic] = useState('Project Review');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    const path = 'bookings';
    try {
      await addDoc(collection(db, path), {
        userId: user.uid,
        topic,
        date,
        time,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      notify('success', 'Booking Confirmed', `Scheduled for ${date} at ${time}.`);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (err: any) {
      console.error(err);
      notify('error', 'Booking Failed', err.message || 'Something went wrong while securing your slot.');
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
          >
            {success ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Booking Successful!</h3>
                <p className="text-slate-500">We'll review your request and contact you shortly.</p>
              </div>
            ) : (
              <>
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="p-8 sm:p-12">
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Book a Consultation</h3>
                  <p className="text-slate-500 mb-10">Select a topic and preferred time for your project review.</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">Topic of Discussion</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {['Project Review', 'Credit Modeling', 'EDA Strategy'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTopic(t)}
                            className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                              topic === t 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
                                : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Preferred Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="date" 
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Preferred Time</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="time" 
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
                      <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 leading-relaxed italic">
                        By booking, you agree to share your basic profile info with our analytics team for context.
                      </p>
                    </div>

                    <button 
                      disabled={loading}
                      type="submit"
                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Booking'}
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
