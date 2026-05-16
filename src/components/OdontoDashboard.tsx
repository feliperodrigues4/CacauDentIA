import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { BookOpen, ArrowRight } from 'lucide-react';

// Mock data based on general odontological statistics
const PREVALENCE_DATA = [
  { name: 'Cárie Dentária', value: 45, fill: '#0ea5e9' },
  { name: 'Doença Periodontal', value: 30, fill: '#10b981' },
  { name: 'Maloclusão', value: 15, fill: '#8b5cf6' },
  { name: 'Edentulismo', value: 10, fill: '#f59e0b' },
];

const TREATMENT_SUCCESS_DATA = [
  { name: 'Implantes', success: 97, years: '5 anos' },
  { name: 'Endodontia', success: 92, years: '5 anos' },
  { name: 'Resinas', success: 85, years: '5 anos' },
  { name: 'Prótese Fixa', success: 90, years: '5 anos' },
];

const PATIENT_GROWTH = [
  { month: 'Jan', consultas: 45 },
  { month: 'Fev', consultas: 52 },
  { month: 'Mar', consultas: 48 },
  { month: 'Abr', consultas: 61 },
  { month: 'Mai', consultas: 55 },
  { month: 'Jun', consultas: 67 },
];

const COLORS = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

export const OdontoDashboard = ({ onViewArticles }: { onViewArticles?: () => void }) => {
  return (
    <div className="space-y-8 p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-y-auto max-h-[80vh] transition-colors">
      <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Indicadores Clínicos & Ciência</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dados agregados baseados em literatura e produtividade</p>
        </div>
        {onViewArticles && (
          <button 
            onClick={onViewArticles}
            className="flex items-center gap-2 px-4 py-2 bg-clinical-50 dark:bg-clinical-900/30 text-clinical-700 dark:text-clinical-300 rounded-xl text-xs font-bold hover:bg-clinical-100 dark:hover:bg-clinical-900/50 transition-colors"
          >
            Ver Artigos Científicos
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Quick Access Articles Card */}
        <div 
          onClick={onViewArticles}
          className="bg-gradient-to-r from-clinical-600 to-clinical-700 p-6 rounded-2xl border border-clinical-500 md:col-span-2 cursor-pointer group hover:shadow-lg hover:shadow-clinical-100 dark:hover:shadow-clinical-900/20 transition-all flex justify-between items-center"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
              <BookOpen size={28} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Biblioteca Científica</h4>
              <p className="text-clinical-50 text-xs">Acesse os últimos artigos, periódicos e estudos de caso atualizados.</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
            <ArrowRight size={20} />
          </div>
        </div>

        {/* Prevalence Chart */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Prevalência de Condições (%)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PREVALENCE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PREVALENCE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'var(--tw-colors-slate-900, #0f172a)',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Treatment Success */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Taxa de Sucesso Clínico (%)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TREATMENT_SUCCESS_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} className="text-xs font-medium text-slate-600 dark:text-slate-400" />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'var(--tw-colors-slate-900, #0f172a)',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="success" fill="#0ea5e9" radius={[0, 8, 8, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trends */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 md:col-span-2">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Volume de Atendimento (Mensal)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PATIENT_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs font-medium text-slate-500 dark:text-slate-400" dy={10} />
                <YAxis axisLine={false} tickLine={false} className="text-xs font-medium text-slate-500 dark:text-slate-400" />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'var(--tw-colors-slate-900, #0f172a)',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="consultas" 
                  stroke="#0ea5e9" 
                  strokeWidth={3} 
                  dot={{ r: 6, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-clinical-50 dark:bg-clinical-900/20 rounded-xl border border-clinical-100 dark:border-clinical-800/50 italic text-xs text-clinical-800 dark:text-clinical-300">
        * Dados Meramente Ilustrativos para demonstração do módulo de Analytics. No consultório real, estes dados seriam sincronizados com seu software de gestão.
      </div>
    </div>
  );
};
