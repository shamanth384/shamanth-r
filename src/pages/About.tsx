import React from 'react';
import { Info, Database, Activity, Cpu, CheckCircle2 } from 'lucide-react';

const SectionHeader = ({ title, subtitle, icon: Icon }: { title: string, subtitle?: string, icon?: any }) => (
  <div className="mb-12 text-center md:text-left">
    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
      {Icon && <Icon className="w-6 h-6 text-blue-600" />}
      <h2 className="text-3xl font-sans font-bold tracking-tight text-slate-900 md:text-4xl">{title}</h2>
    </div>
    {subtitle && <p className="text-slate-600 max-w-2xl text-lg leading-relaxed">{subtitle}</p>}
  </div>
);

export default function About() {
  return (
    <section className="py-32 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader 
          title="About the Project" 
          subtitle="Understanding the core objectives and the technical stack driving this analysis."
          icon={Info}
        />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200">
            <Database className="w-10 h-10 text-blue-600 mb-6" />
            <h3 className="text-xl font-bold mb-4">The Dataset</h3>
            <p className="text-slate-600 mb-6">Comprehensive loan portfolio data spanning 5 years, including customer demographics, financial records, and historical repayment behavior.</p>
            <ul className="space-y-2 text-sm text-slate-500 italic">
              <li>• 15k+ Records</li>
              <li>• 24 Critical Features</li>
              <li>• Real-world scenarios</li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200">
            <Activity className="w-10 h-10 text-emerald-600 mb-6" />
            <h3 className="text-xl font-bold mb-4">Objective</h3>
            <p className="text-slate-600 mb-6">Leverage EDA to uncover non-obvious patterns that lead to loan defaults and build a robust profile of high-risk borrowers.</p>
            <div className="mt-auto space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Trend Identification
              </div>
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Risk Score Modeling
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200">
            <Cpu className="w-10 h-10 text-slate-600 mb-6" />
            <h3 className="text-xl font-bold mb-4">Stack & Tools</h3>
            <p className="text-slate-600 mb-6">Built using the modern data science pipeline for maximum insight extraction and visualization clarity.</p>
            <div className="flex flex-wrap gap-2">
              {['Python', 'Pandas', 'Seaborn', 'Recharts', 'React'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-mono text-slate-700">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Activity className="w-32 h-32" />
          </div>
          <h3 className="text-2xl font-bold mb-6">Why Exploratory Data Analysis?</h3>
          <div className="grid md:grid-cols-2 gap-10">
            <p className="text-slate-600 leading-relaxed">
              EDA is the critical first step in any data science project. It allows us to understand the underlying structure of the dataset, detect anomalies, test hypotheses, and check assumptions. In credit risk, this means identifying the hidden variables that truly drive defaults.
            </p>
            <p className="text-slate-600 leading-relaxed">
              By visualizing distributions and correlations, we move beyond simple averages to see the gradients of risk. This project demonstrates how visual evidence can replace intuition in financial decision-making processes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
