import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Info, Grid3X3, Box } from 'lucide-react';
import { INCOME_DISTRIBUTION, LOAN_STATUS_DATA, CORRELATION_MATRIX, BOXPLOT_DATA } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

const SectionHeader = ({ title, subtitle, icon: Icon }: { title: string, subtitle?: string, icon?: any }) => (
  <div className="mb-12 text-center md:text-left">
    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
      {Icon && <Icon className="w-6 h-6 text-blue-600" />}
      <h2 className="text-3xl font-sans font-bold tracking-tight text-slate-900 md:text-4xl">{title}</h2>
    </div>
    {subtitle && <p className="text-slate-600 max-w-2xl text-lg leading-relaxed">{subtitle}</p>}
  </div>
);

const InsightBox = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex gap-4">
    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
    <div className="text-sm text-slate-700 leading-relaxed italic">{children}</div>
  </div>
);

const HeatmapCell: React.FC<{ value: number }> = ({ value }) => {
  // Map value from -1 to 1 to a color scale
  // Positive: Blue, Negative: Red, Zero: White/Grey
  const getBG = (val: number) => {
    if (val >= 0.8) return 'bg-blue-600 text-white';
    if (val >= 0.6) return 'bg-blue-500 text-white';
    if (val >= 0.4) return 'bg-blue-400 text-white';
    if (val >= 0.2) return 'bg-blue-200 text-blue-900';
    if (val > -0.2) return 'bg-slate-50 text-slate-400';
    if (val <= -0.6) return 'bg-red-500 text-white';
    if (val <= -0.4) return 'bg-red-400 text-white';
    return 'bg-red-200 text-red-900';
  };

  return (
    <div className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-all hover:scale-105 cursor-default ${getBG(value)}`}>
      {value.toFixed(2)}
    </div>
  );
};

const BoxPlotChart = ({ data }: { data: typeof BOXPLOT_DATA[0] }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  
  const width = 1000;
  const height = 120;
  const padding = 60;
  
  const scale = (val: number) => {
    return padding + ((val - data.min) / (data.max - data.min)) * (width - 2 * padding);
  };

  const stats = [
    { label: 'Min', value: data.min },
    { label: 'Q1', value: data.q1 },
    { label: 'Median', value: data.median },
    { label: 'Q3', value: data.q3 },
    { label: 'Max', value: data.max },
  ];

  return (
    <div className="relative group">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Whiskers line */}
        <line 
          x1={scale(data.min)} y1={height/2} 
          x2={scale(data.max)} y2={height/2} 
          stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4"
        />
        
        {/* Min/Max vertical lines */}
        <line x1={scale(data.min)} y1={height/2 - 15} x2={scale(data.min)} y2={height/2 + 15} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <line x1={scale(data.max)} y1={height/2 - 15} x2={scale(data.max)} y2={height/2 + 15} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />

        {/* The Box */}
        <rect 
          x={scale(data.q1)} 
          y={height/2 - 25} 
          width={scale(data.q3) - scale(data.q1)} 
          height="50" 
          fill="#3b82f6" 
          fillOpacity="0.1" 
          stroke="#3b82f6" 
          strokeWidth="2" 
          rx="8"
        />

        {/* Median line */}
        <line 
          x1={scale(data.median)} y1={height/2 - 25} 
          x2={scale(data.median)} y2={height/2 + 25} 
          stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round"
        />

        {/* Interactive Zones */}
        {stats.map((s) => (
          <circle
            key={s.label}
            cx={scale(s.value)}
            cy={height/2}
            r="12"
            fill="transparent"
            className="cursor-pointer outline-none"
            onMouseEnter={() => setHovered(s.label)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </svg>

      {/* Interactive Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-10 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl pointer-events-none"
            style={{ 
              left: `${(scale(stats.find(s => s.label === hovered)!.value) / width) * 100}%`,
              transform: 'translateX(-50%)',
              top: '-20px'
            }}
          >
            {hovered}: {data.unit}{stats.find(s => s.label === hovered)!.value.toLocaleString()}
            <div className="absolute top-full left-1/2 -translateX-1/2 border-8 border-transparent border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between mt-4 font-mono text-[10px] text-slate-400 font-bold uppercase tracking-widest px-[60px]">
        <span>Min: {data.unit}{data.min.toLocaleString()}</span>
        <span>Median: {data.unit}{data.median.toLocaleString()}</span>
        <span>Max: {data.unit}{data.max.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default function EDA() {
  return (
    <section className="py-32 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader 
          title="Exploratory Data Analysis" 
          subtitle="The deep dive into distributions, correlations, and outliers."
          icon={BarChart3}
        />
        
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Chart 1 */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Income Distribution</h3>
              <span className="text-xs font-mono text-slate-400">Histogram Map</span>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INCOME_DISTRIBUTION}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <InsightBox>
              Middle-income earners ($40k-$60k) make up the bulk of the applicant pool. We see a significant drop-off in high-income participants, highlighting a need for varied product offerings.
            </InsightBox>
          </div>

          {/* Chart 2 */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Loan Performance</h3>
              <span className="text-xs font-mono text-slate-400">Pie Distribution</span>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={LOAN_STATUS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {LOAN_STATUS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {LOAN_STATUS_DATA.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-slate-500">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
            <InsightBox>
              While 72% of loans are stable, a 10% default rate is critical. Analysis shows a strong correlation between "Small Business" loans and high default rates compared to Home Mortgages.
            </InsightBox>
          </div>
        </div>

        {/* Outlier Analysis & Boxplots */}
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm mb-12 overflow-hidden">
          <div className="mb-12">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Box className="w-6 h-6 text-blue-600" />
              Spread & Outlier Analysis
            </h3>
            <p className="text-slate-500 text-sm mt-1">Detecting extreme values through Five-Number Summaries (Boxplots).</p>
          </div>

          <div className="space-y-16">
            {BOXPLOT_DATA.map((item) => (
              <div key={item.feature}>
                <div className="flex justify-between items-end mb-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{item.feature}</h4>
                  <div className="text-[10px] bg-blue-50 text-blue-600 font-black px-2 py-1 rounded uppercase">Unit: {item.unit}</div>
                </div>
                <BoxPlotChart data={item} />
              </div>
            ))}
          </div>

          <InsightBox>
            Boxplots reveal that the <span className="font-bold">Loan Amount</span> distribution has significant outliers reaching up to $110,000, while the typical loan stays well below $30,000. These outliers represent our most scrutinized accounts during the auditing process.
          </InsightBox>
        </div>

        {/* Feature Correlation Heatmap */}
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Grid3X3 className="w-6 h-6 text-blue-600" />
                Feature Correlation Matrix
              </h3>
              <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-semibold">Pearson Correlation Coefficient</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-bold">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded" /> Strong Positive</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-200 rounded" /> Neutral</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded" /> Strong Negative</div>
            </div>
          </div>

          <div className="relative overflow-x-auto">
            <div className="min-w-[500px]">
              {/* Header labels */}
              <div className="grid grid-cols-[100px_repeat(5,1fr)] mb-4">
                <div />
                {CORRELATION_MATRIX.features.map(feat => (
                  <div key={feat} className="text-center text-xs font-bold text-slate-400">{feat}</div>
                ))}
              </div>

              {/* Rows */}
              <div className="space-y-2">
                {CORRELATION_MATRIX.features.map((rowFeat, rowIndex) => (
                  <div key={rowFeat} className="grid grid-cols-[100px_repeat(5,1fr)] gap-2 items-center">
                    <div className="text-right pr-4 text-xs font-bold text-slate-400">{rowFeat}</div>
                    {CORRELATION_MATRIX.data[rowIndex].map((val, colIndex) => (
                      <HeatmapCell key={`${rowIndex}-${colIndex}`} value={val} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic flex gap-4">
            <Info className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>Critical Relationship:</strong> The strong negative correlation (-0.68) between <span className="font-bold">Score</span> and <span className="font-bold">Debt-to-Income (DTI)</span> confirms that as financial leverage increases, creditworthiness tends to erode sharply. Conversely, the link between <span className="font-bold">Income</span> and <span className="font-bold">Loan Amount</span> (0.65) validates that higher earners are granted significantly larger credit facilities.
            </p>
          </div>
        </div>

        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-8">Multivariate Findings</h3>
            <div className="space-y-8">
                <div className="flex gap-6 items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">1</div>
                    <div>
                        <h4 className="font-bold mb-1">Debt-to-Income vs Default</h4>
                        <p className="text-slate-500 text-sm italic">"As DTI crosses 35%, default rates climb exponentially regardless of income bracket."</p>
                    </div>
                </div>
                <div className="flex gap-6 items-start">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600 font-bold">2</div>
                    <div>
                        <h4 className="font-bold mb-1">Credit Score thresholds</h4>
                        <p className="text-slate-500 text-sm italic">"A credit score below 640 paired with a loan amount exceeding $15,000 is the highest risk cluster identified."</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
