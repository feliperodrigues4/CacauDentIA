import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, ExternalLink, GraduationCap, Search, FlaskConical, Newspaper, Globe, Sparkles } from 'lucide-react';

interface ArticleSource {
  name: string;
  url: string;
  description: string;
  type: 'journal' | 'database' | 'portal';
}

const SOURCES: ArticleSource[] = [
  {
    name: 'PubMed - Dentistry',
    url: 'https://pubmed.ncbi.nlm.nih.gov/?term=dentistry',
    description: 'A maior base de dados de literatura biomédica do mundo.',
    type: 'database'
  },
  {
    name: 'Journal of the American Dental Association (JADA)',
    url: 'https://jada.ada.org/',
    description: 'A mais lida publicação dentária, com foco em ciência clínica.',
    type: 'journal'
  },
  {
    name: 'British Dental Journal (BDJ)',
    url: 'https://www.nature.com/bdj/',
    description: 'Artigos revisados por pares e notícias do mundo odontológico.',
    type: 'journal'
  },
  {
    name: 'Google Scholar - Odontologia',
    url: 'https://scholar.google.com.br/scholar?q=odontologia',
    description: 'Ferramenta poderosa para busca de artigos acadêmicos e teses.',
    type: 'database'
  },
  {
    name: 'ABO - Revista Virtual',
    url: 'https://www.abo.org.br/revista',
    description: 'Portal da Associação Brasileira de Odontologia.',
    type: 'portal'
  },
  {
    name: 'Scielo - Odontologia',
    url: 'https://search.scielo.org/?q=odontologia',
    description: 'Biblioteca eletrônica com vasta coleção de periódicos científicos brasileiros.',
    type: 'database'
  }
];

const RECENT_TOPICS = [
  { title: "Avanços em Implantodontia Digital", category: "Novas Tecnologias" },
  { title: "Protocolos de Desinfecção Pós-Pandemia", category: "Biossegurança" },
  { title: "Uso de IA no Diagnóstico por Imagem", category: "Diagnóstico" },
  { title: "Materiais Biocerâmicos na Endodontia", category: "Materiais" }
];

export default function ScientificArticles({ onSummarize }: { onSummarize?: (title: string, category?: string) => void }) {
  return (
    <div className="space-y-6 md:space-y-10 pb-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-clinical-600 to-clinical-800 rounded-3xl p-6 md:p-10 text-white shadow-xl shadow-clinical-200 dark:shadow-clinical-900/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-widest uppercase mx-auto md:mx-0">
              <FlaskConical size={14} />
              Educação Continuada
            </div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Artigos Científicos</h2>
            <p className="text-clinical-50 max-w-md text-sm md:text-base leading-relaxed mx-auto md:mx-0">
              Acesse as mídias mais confiáveis do mundo e mantenha-se atualizado com as evidências científicas mais recentes da odontologia moderna.
            </p>
          </div>
          <motion.div 
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            className="w-24 h-24 md:w-40 md:h-40 bg-white/10 rounded-3xl backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0"
          >
            <BookOpen size={48} className="opacity-80 md:hidden" />
            <BookOpen size={80} className="opacity-80 hidden md:block" />
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Sources */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 px-4 md:px-2">
            <Globe className="text-clinical-600 dark:text-clinical-400" size={20} />
            <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">Principais Periódicos e Bases</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2 md:px-0">
            {SOURCES.map((source, index) => (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-clinical-400 dark:hover:border-clinical-500 hover:shadow-xl hover:shadow-clinical-50 dark:hover:shadow-clinical-900/20 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${
                    source.type === 'journal' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                    source.type === 'database' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  }`}>
                    {source.type === 'journal' ? <Newspaper size={20} /> : 
                     source.type === 'database' ? <Search size={20} /> : <Globe size={20} />}
                  </div>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-300 dark:text-slate-700 hover:text-clinical-500 transition-colors">
                    <ExternalLink size={18} />
                  </a>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base mb-2 leading-tight">{source.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-4">{source.description}</p>
                
                {onSummarize && (
                  <button 
                    onClick={() => onSummarize(source.name, source.type === 'journal' ? 'Periódico' : 'Base de Dados')}
                    className="flex items-center gap-2 px-4 py-2 w-full justify-center bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-clinical-50 dark:hover:bg-clinical-900/30 hover:text-clinical-700 dark:hover:text-clinical-400 transition-all border border-slate-100 dark:border-slate-700"
                  >
                    <Sparkles size={14} className="text-clinical-500" />
                    Resumir Tendências
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Topics */}
        <div className="space-y-6 lg:mt-0 mt-4 px-2 md:px-0">
          <div className="flex items-center gap-2 px-2 lg:px-4">
            <GraduationCap className="text-clinical-600 dark:text-clinical-400" size={20} />
            <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">Tópicos em Alta</h3>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] p-6 md:p-8 border border-slate-100 dark:border-slate-800 space-y-5 transition-colors">
            {RECENT_TOPICS.map((topic, index) => (
              <motion.div 
                key={index} 
                className="group p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md dark:hover:border-clinical-800"
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-1.5 h-auto bg-clinical-500 rounded-full shrink-0" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-clinical-600 dark:text-clinical-400 uppercase tracking-widest">{topic.category}</span>
                    <h5 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">{topic.title}</h5>
                  </div>
                </div>
                
                {onSummarize && (
                  <button 
                    onClick={() => onSummarize(topic.title, topic.category)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-clinical-50 dark:bg-clinical-900/40 text-clinical-700 dark:text-clinical-400 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-clinical-100 dark:hover:bg-clinical-900/60 transition-colors w-full justify-center"
                  >
                    <Sparkles size={12} />
                    Resumir com IA
                  </button>
                )}
              </motion.div>
            ))}
            
            <div className="pt-6 mt-2 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center leading-relaxed">
                Dica: Você pode pedir para a <strong>Cacau Dent.IA</strong> resumir um tema específico destes artigos para um caso clínico.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
