import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils';
import { X, Calendar, Clock, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

interface Booking {
  id: string;
  topic: string;
  date: string;
  time: string;
  status: string;
  createdAt: Timestamp;
}

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      fetchBookings();
    }
  }, [isOpen, user]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'bookings'), 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedBookings: Booking[] = [];
      querySnapshot.forEach((doc) => {
        fetchedBookings.push({ id: doc.id, ...doc.data() } as Booking);
      });
      setBookings(fetchedBookings);
    } catch (err) {
      console.error(err);
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
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 sm:p-12 overflow-y-auto">
              <h3 className="text-3xl font-bold text-slate-900 mb-2">My Bookings</h3>
              <p className="text-slate-500 mb-10">Track your consultation requests and their status.</p>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  <p className="text-slate-400 font-medium">Fetching your bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No bookings found.</p>
                  <p className="text-slate-400 text-sm mt-1">Book your first consultation today!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-all flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                            booking.status === 'pending' ? "bg-amber-100 text-amber-600" :
                            booking.status === 'confirmed' ? "bg-emerald-100 text-emerald-600" :
                            "bg-red-100 text-red-600"
                          )}>
                            {booking.status}
                          </span>
                          <h4 className="font-bold text-slate-900">{booking.topic}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {booking.date}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {booking.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
