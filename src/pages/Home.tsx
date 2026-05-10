import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, ArrowRight, Activity, PieChart as PieIcon } from 'lucide-react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import { REPAYMENT_HISTORY_TREND } from '../constants';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white min-h-[90vh] flex items-center">
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl -ml-40 -mb-40" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
              <TrendingUp className="w-3 h-3" />
              Data Science Project
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Credit Risk <br />
              <span className="text-blue-600">Analysis</span> using EDA
            </h1>
            <p className="text-slate-600 text-xl leading-relaxed mb-10 max-w-lg">
              Harnessing the power of Exploratory Data Analysis to identify, quantify, and mitigate financial risks in modern lending.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/eda" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all">
                Explore Analysis <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="bg-white border-2 border-slate-200 text-slate-900 px-8 py-4 rounded-xl font-semibold hover:border-slate-300 transition-all">
                About Project
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-slate-900 rounded-[2rem] p-6 shadow-2xl shadow-blue-900/20">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="ml-4 h-5 w-32 bg-slate-800 rounded opacity-50" />
              </div>
              <div className="h-64 rounded-xl overflow-hidden bg-slate-800 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REPAYMENT_HISTORY_TREND}>
                    <Line type="monotone" dataKey="performance" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="h-20 bg-slate-800 rounded-xl flex items-center justify-center">
                  <Activity className="w-8 h-8 text-blue-400 opacity-50" />
                </div>
                <div className="h-20 bg-slate-800 rounded-xl flex items-center justify-center">
                  <PieIcon className="w-8 h-8 text-emerald-400 opacity-50" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
