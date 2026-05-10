import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, TrendingUp, ShieldAlert, PieChart as PieIcon, Cpu, CheckCircle2 } from 'lucide-react';

const SectionHeader = ({ title, subtitle, icon: Icon }: { title: string, subtitle?: string, icon?: any }) => (
  <div className="mb-12 text-center md:text-left">
    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
      {Icon && <Icon className="w-6 h-6 text-blue-600" />}
      <h2 className="text-3xl font-sans font-bold tracking-tight text-slate-900 md:text-4xl">{title}</h2>
    </div>
    {subtitle && <p className="text-slate-600 max-w-2xl text-lg leading-relaxed">{subtitle}</p>}
  </div>
);

export default function Insights() {
  return (
    <section className="py-32 bg-slate-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader 
          title="Key Business Insights" 
          subtitle="Distilling raw data into strategic executive summaries."
        />
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Income Tier Sensitivity</h4>
                <p className="text-slate-400 leading-relaxed">Applicants with a debt-to-income ratio &gt; 40% exhibit a default probability 3x higher than the average, regardless of their credit score.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Default Clusters</h4>
                <p className="text-slate-400 leading-relaxed">Geographic analysis revealed default "hotspots" in suburban regions where localized economic slumps directly impacted repayment velocity.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <PieIcon className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Seasonal Repayment Fluctuations</h4>
                <p className="text-slate-400 leading-relaxed">Repayment performance dips significantly during Q1 (post-holiday spending). Adjusting payment grace periods during this window could improve total recovery by 8%.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-bold">Predictive Model</div>
                <div className="text-xs text-slate-400 underline cursor-pointer hover:text-blue-400">Random Forest Classifier</div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Model Accuracy</span>
                  <span className="font-mono text-blue-400">89.4%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '89%' }} className="h-full bg-blue-500" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Precision</span>
                  <span className="font-mono text-emerald-400">91.2%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '91%' }} className="h-full bg-emerald-500" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Recall</span>
                  <span className="font-mono text-amber-400">82.1%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '82%' }} className="h-full bg-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 p-12 bg-white rounded-[3rem] text-slate-900 border border-slate-200">
           <h3 className="text-3xl font-bold text-center mb-12">Business Recommendations</h3>
           <div className="grid sm:grid-cols-2 gap-8 text-left mt-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-3" />
              <h5 className="font-bold mb-2">Automated Tiering</h5>
              <p className="text-xs text-slate-500">Implement dynamic interest rates based on the multi-factor risk scores derived in this EDA.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-3" />
              <h5 className="font-bold mb-2">Proactive Monitoring</h5>
              <p className="text-xs text-slate-500">Enable automated outreach for customers hitting "at-risk" behavioral clusters early before default occurs.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
