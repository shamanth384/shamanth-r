import React, { useState } from 'react';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils';
import { X, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationCenter';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddRecordModal({ isOpen, onClose, onSuccess }: AddRecordModalProps) {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    age: 30,
    income: 50000,
    loanAmount: 10000,
    creditScore: 700,
    status: 'Approved' as 'Approved' | 'Denied' | 'Defaulted'
  });

  const calculateDecision = (income: number, score: number, loan: number) => {
    const dti = income > 0 ? loan / income : 10;
    
    if (score < 580) return { status: 'Denied' as const, reason: 'Credit score is below the minimum threshold (580).' };
    if (dti > 6) return { status: 'Denied' as const, reason: 'Loan amount exceeds 6x of annual income (High Debt-to-Income ratio).' };
    if (income < 15000) return { status: 'Denied' as const, reason: 'Annual income is below the minimum operational requirement.' };
    
    if (score < 660 && dti > 3) return { status: 'Defaulted' as const, reason: 'Moderate credit with high debt leads to a high default risk profile.' };
    
    if (score >= 750) return { status: 'Approved' as const, reason: 'Excellent credit score demonstrates a reliable repayment history.' };
    if (dti <= 2) return { status: 'Approved' as const, reason: 'Very low debt-to-income ratio indicates strong financial stability.' };
    
    return { status: 'Approved' as const, reason: 'Applicant meets the minimum requirements for a stable lending profile.' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to add records.');
      return;
    }

    setLoading(true);
    setError(null);

    const { status } = calculateDecision(formData.income, formData.creditScore, formData.loanAmount);

    const path = 'credit_records';
    try {
      await addDoc(collection(db, path), {
        ...formData,
        status,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      notify('success', 'Record Saved', 'The credit audit record has been successfully finalized.');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error adding record:', err);
      const displayMessage = err.message || 'Failed to add record. Please try again.';
      setError(displayMessage);
      notify('error', 'Operation Failed', displayMessage);
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setLoading(false);
    }
  };

  const decision = calculateDecision(formData.income, formData.creditScore, formData.loanAmount);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Add Credit Record</h2>
                  <p className="text-slate-500 text-sm">Decision is automated based on risk profile</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-600 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                    <input
                      type="number"
                      required
                      min="18"
                      max="120"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Credit Score</label>
                    <input
                      type="number"
                      required
                      min="300"
                      max="850"
                      value={formData.creditScore}
                      onChange={(e) => setFormData({ ...formData, creditScore: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Annual Income ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.income}
                      onChange={(e) => setFormData({ ...formData, income: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Loan Amount ($)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.loanAmount}
                      onChange={(e) => setFormData({ ...formData, loanAmount: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">AI Decision</span>
                    <span className={cn(
                      "px-4 py-1 rounded-full text-xs font-bold transition-all duration-300",
                      decision.status === 'Approved' ? "bg-emerald-100 text-emerald-700" : 
                      decision.status === 'Denied' ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {decision.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    {decision.reason}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/10"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Finalize & Save Record
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
