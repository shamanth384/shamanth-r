import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, Book, HelpCircle, FileText, 
  ChevronRight, ExternalLink, ShieldCheck, 
  CreditCard, PieChart, Info, Mail
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Book,
    description: 'Learn the basics of using RiskPulse for credit monitoring.',
    faqs: [
      { q: "How is my credit risk calculated?", a: "RiskPulse uses a multi-factor analysis including income-to-debt ratio, credit score history, and current loan amounts to generate a risk profile." },
      { q: "Can I manualy add loan records?", a: "Yes, head to the 'Data' section to manually input loan data for immediate risk auditing." },
    ]
  },
  {
    id: 'risk-analysis',
    title: 'Risk Analysis',
    icon: ShieldCheck,
    description: 'Deep dive into our auditing algorithms and metrics.',
    faqs: [
      { q: "What constitutes a 'Defaulted' state?", a: "A defaulted state is flagged when an applicant's credit score drops below 580 and their Debt-to-Income (DTI) ratio exceeds 4x." },
      { q: "How reliable are the predictions?", a: "Our models achieve 94% accuracy in historical backtesting against standard industry benchmarks." },
    ]
  },
  {
    id: 'privacy',
    title: 'Security & Privacy',
    icon: ExternalLink,
    description: 'How we protect your data and maintain compliance.',
    faqs: [
      { q: "Is my personal data encrypted?", a: "All data ingested into RiskPulse is encrypted at rest using AES-256 and in transit via TLS 1.3." },
      { q: "Who can see my audit reports?", a: "Only authorized analysts with premium access can view granular reports. Standard users see aggregate statistics." },
    ]
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

  const filteredFaqs = CATEGORIES.flatMap(cat => 
    cat.faqs.filter(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-800/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6"
          >
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono text-white/60 uppercase tracking-widest">Help Center</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-sans font-bold tracking-tight text-white mb-8"
          >
            How can we help you?
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative group"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for questions, features, or tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 text-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        {searchQuery ? (
          <div className="space-y-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-slate-400">Search results for</span> "{searchQuery}"
            </h2>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100"
                >
                  <h3 className="text-xl font-bold mb-4">{faq.q}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest">No matching results found.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-[300px_1fr] gap-16">
            {/* Sidebar Navigation */}
            <aside className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-4">Categories</h3>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all text-left",
                    activeCategory === cat.id ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <cat.icon className={cn("w-5 h-5", activeCategory === cat.id ? "text-blue-600" : "text-slate-400")} />
                  {cat.title}
                </button>
              ))}
              
              <div className="pt-12">
                <div className="p-6 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative group cursor-pointer">
                  <div className="relative z-10">
                    <Mail className="w-6 h-6 text-blue-400 mb-4" />
                    <h4 className="text-lg font-bold mb-2">Still stuck?</h4>
                    <p className="text-sm text-slate-400 mb-4 font-mono">Our lead analysts are ready to help 24/7.</p>
                    <Link to="/contact" className="text-xs flex items-center gap-1 text-blue-400 font-bold hover:underline">
                      Contact Support <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
                </div>
              </div>
            </aside>

            {/* Category FAQ Content */}
            <div className="space-y-12">
              {CATEGORIES.filter(c => c.id === activeCategory).map(cat => (
                <div key={cat.id}>
                  <div className="mb-12">
                     <h2 className="text-4xl font-sans font-bold tracking-tight mb-4">{cat.title}</h2>
                     <p className="text-xl text-slate-500 max-w-2xl">{cat.description}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {cat.faqs.map((faq, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 bg-white border border-slate-200 rounded-[2.5rem] hover:shadow-xl transition-all hover:-translate-y-1"
                      >
                         <h4 className="text-lg font-bold mb-4 flex gap-3">
                           <span className="text-blue-600 font-mono text-xs mt-1">Q{i+1}:</span>
                           {faq.q}
                         </h4>
                         <p className="text-slate-600 text-sm leading-relaxed pl-7">
                           {faq.a}
                         </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Quick Links Footer */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
           <div className="p-8 bg-white rounded-3xl border border-slate-200">
             <CreditCard className="w-8 h-8 text-blue-600 mb-4" />
             <h5 className="font-bold mb-2">Billing Support</h5>
             <p className="text-sm text-slate-500 mb-4">View your subscription status and invoice history.</p>
             <button className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">Manage &rarr;</button>
           </div>
           <div className="p-8 bg-white rounded-3xl border border-slate-200">
             <PieChart className="w-8 h-8 text-blue-600 mb-4" />
             <h5 className="font-bold mb-2">API Documentation</h5>
             <p className="text-sm text-slate-500 mb-4">Integrate our credit risk algorithms into your systems.</p>
             <button className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">Docs &rarr;</button>
           </div>
           <div className="p-8 bg-white rounded-3xl border border-slate-200">
             <FileText className="w-8 h-8 text-blue-600 mb-4" />
             <h5 className="font-bold mb-2">Legal Center</h5>
             <p className="text-sm text-slate-500 mb-4">Privacy Policy, Terms of Service, and Compliance Docs.</p>
             <button className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">View &rarr;</button>
           </div>
        </div>
      </section>
    </div>
  );
}
