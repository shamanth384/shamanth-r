import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Database, Plus, Trash2, Loader2 } from 'lucide-react';
import { CREDIT_DATA_SUMMARY, SAMPLE_DATA } from '../constants';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { AddRecordModal } from '../lib/AddRecordModal';
import { useNotification } from '../lib/NotificationCenter';

const SectionHeader = ({ title, subtitle, icon: Icon, action }: { title: string, subtitle?: string, icon?: any, action?: React.ReactNode }) => (
  <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div className="text-center md:text-left">
      <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
        {Icon && <Icon className="w-6 h-6 text-blue-600" />}
        <h2 className="text-3xl font-sans font-bold tracking-tight text-slate-900 md:text-4xl">{title}</h2>
      </div>
      {subtitle && <p className="text-slate-600 max-w-2xl text-lg leading-relaxed">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default function DataOverview() {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [manualRecords, setManualRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    if (!user) return;
    setLoading(true);
    const path = 'credit_records';
    try {
      const q = query(
        collection(db, path),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setManualRecords(records);
    } catch (err) {
      console.error('Error fetching records:', err);
      notify('error', 'Data Sync Failed', 'We couldn\'t retrieve your manual records. Please refresh or check your connection.');
      handleFirestoreError(err, OperationType.LIST, path);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    const path = `credit_records/${id}`;
    try {
      const loadingId = notify('loading', 'Deleting...', 'Removing record from encrypted storage.');
      await deleteDoc(doc(db, 'credit_records', id));
      setManualRecords(prev => prev.filter(r => r.id !== id));
      notify('success', 'Deleted', 'Record has been permanently removed.');
    } catch (err) {
      console.error('Error deleting record:', err);
      notify('error', 'Deletion Failed', 'Failed to remove the record. You may not have permission.');
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  return (
    <section className="py-32 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader 
          title="Data Overview" 
          subtitle="A high-level glimpse of the raw input used to shape our conclusions."
          icon={Database}
          action={user && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
            >
              <Plus className="w-5 h-5" />
              Add Manual Record
            </button>
          )}
        />
        
        {/* Stats Grid */}
        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          {CREDIT_DATA_SUMMARY.map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-200"
            >
              <div className="text-slate-500 text-sm font-medium mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Feature Descriptions */}
        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 mb-12">
            <h4 className="text-lg font-bold mb-6">Feature Descriptions</h4>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="font-mono text-sm text-blue-600 font-bold">income</span>
                    <span className="text-sm text-slate-500">Annual income of the applicant ($)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="font-mono text-sm text-blue-600 font-bold">loan_amount</span>
                    <span className="text-sm text-slate-501 text-slate-500">Total amount borrowed ($)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="font-mono text-sm text-blue-600 font-bold">credit_score</span>
                    <span className="text-sm text-slate-500">Rating derived from repayment history</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-3">
                    <span className="font-mono text-sm text-blue-600 font-bold">status</span>
                    <span className="text-sm text-slate-500">Current loan state (Approved/Denied/Defaulted)</span>
                </div>
            </div>
        </div>

        {/* Manual Records Section */}
        {user && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Plus className="w-5 h-5 text-blue-600" />
              <h3 className="text-2xl font-bold">Your Manual Records</h3>
            </div>
            
            <div className="overflow-x-auto rounded-[2rem] border border-slate-200 shadow-sm bg-white">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p>Loading your data...</p>
                </div>
              ) : manualRecords.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-6">Age</th>
                      <th className="px-6 py-6">Income</th>
                      <th className="px-6 py-6">Loan Amount</th>
                      <th className="px-6 py-6">Credit Score</th>
                      <th className="px-6 py-6">Status</th>
                      <th className="px-6 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {manualRecords.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-6 font-medium">{row.age}</td>
                        <td className="px-6 py-6">${row.income.toLocaleString()}</td>
                        <td className="px-6 py-6">${row.loanAmount.toLocaleString()}</td>
                        <td className="px-6 py-6 font-bold">{row.creditScore}</td>
                        <td className="px-6 py-6">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold",
                            row.status === 'Approved' ? "bg-emerald-100 text-emerald-700" :
                            row.status === 'Denied' ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <button 
                            onClick={() => handleDelete(row.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-20 text-center text-slate-400">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No manual records found. Add one to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Dataset Sample */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Database className="w-5 h-5 text-slate-400" />
            <h3 className="text-2xl font-bold">Global Dataset Sample</h3>
          </div>
          <div className="overflow-x-auto rounded-[2rem] border border-slate-200 shadow-sm bg-white overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-6">ID</th>
                  <th className="px-6 py-6">Age</th>
                  <th className="px-6 py-6">Income</th>
                  <th className="px-6 py-6">Loan Amount</th>
                  <th className="px-6 py-6">Credit Score</th>
                  <th className="px-6 py-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SAMPLE_DATA.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-6 font-mono text-slate-400">{String(row.id).padStart(3, '0')}</td>
                    <td className="px-6 py-6 font-medium">{row.age}</td>
                    <td className="px-6 py-6">{row.income}</td>
                    <td className="px-6 py-6">{row.loan}</td>
                    <td className="px-6 py-6 font-bold">{row.score}</td>
                    <td className="px-6 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        row.status === 'Approved' ? "bg-emerald-100 text-emerald-700" :
                        row.status === 'Denied' ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddRecordModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchRecords} 
      />
    </section>
  );
}
