import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Calendar, 
  History, 
  FileText,
  ChevronRight,
  MoreVertical,
  Filter,
  UserPlus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PatientHistory {
  id: string;
  date: Date;
  procedure: string;
  notes: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: Date;
  history: PatientHistory[];
}

const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Ana Souza',
    email: 'ana.souza@email.com',
    phone: '(11) 98765-4321',
    lastVisit: new Date(2024, 4, 10),
    history: [
      { id: 'h1', date: new Date(2024, 4, 10), procedure: 'Restauração Resina', notes: 'Dente 36, face oclusal. Sem intercorrências.' },
      { id: 'h2', date: new Date(2024, 3, 15), procedure: 'Avaliação Clínica', notes: 'Paciente relata sensibilidade no quadrante inferior esquerdo.' }
    ]
  },
  {
    id: '2',
    name: 'Carlos Lima',
    email: 'carlos.lima@email.com',
    phone: '(11) 91234-5678',
    lastVisit: new Date(2024, 4, 15),
    history: [
      { id: 'h3', date: new Date(2024, 4, 15), procedure: 'Canal (Endo)', notes: 'Sessão 1: Pulpectomia dente 21.' }
    ]
  },
  {
    id: '3',
    name: 'Beatriz Silva',
    email: 'beatriz.s@email.com',
    phone: '(11) 99988-7766',
    lastVisit: new Date(2024, 3, 20),
    history: [
      { id: 'h4', date: new Date(2024, 3, 20), procedure: 'Limpeza e Profilaxia', notes: 'Remoção de tártaro e aplicação de flúor.' }
    ]
  }
];

export const PatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [newRecord, setNewRecord] = useState({ procedure: '', notes: '' });

  const handleAddRecord = () => {
    if (!selectedPatient || !newRecord.procedure.trim()) return;

    const record: PatientHistory = {
      id: `h${Date.now()}`,
      date: new Date(),
      procedure: newRecord.procedure,
      notes: newRecord.notes
    };

    const updatedPatients = patients.map(p => {
      if (p.id === selectedPatient.id) {
        return {
          ...p,
          lastVisit: new Date(),
          history: [record, ...p.history]
        };
      }
      return p;
    });

    setPatients(updatedPatients);
    setSelectedPatient(updatedPatients.find(p => p.id === selectedPatient.id) || null);
    setNewRecord({ procedure: '', notes: '' });
  };

  const filteredPatients = patients.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(searchLower);
    const historyMatch = p.history.some(h => 
      h.procedure.toLowerCase().includes(searchLower) || 
      h.notes.toLowerCase().includes(searchLower)
    );
    return nameMatch || historyMatch;
  });

  return (
    <div className="flex h-full gap-6 flex-col lg:flex-row">
      {/* Patient List */}
      <div className={cn(
        "flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors",
        selectedPatient && "hidden lg:flex"
      )}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Meus Pacientes</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Controle de prontuários e contatos</p>
            </div>
            <button 
              onClick={() => setIsAddingPatient(true)}
              className="flex items-center gap-2 px-4 py-2 bg-clinical-600 text-white rounded-xl text-sm font-bold hover:bg-clinical-700 transition-all shadow-md shadow-clinical-100 dark:shadow-clinical-900/20"
            >
              <UserPlus size={16} />
              Novo Paciente
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nome, procedimento ou notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-200 dark:focus:ring-clinical-800 transition-all text-sm text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredPatients.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPatients.map(patient => (
                <div 
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={cn(
                    "p-4 flex items-center justify-between hover:bg-clinical-50/30 dark:hover:bg-clinical-900/10 cursor-pointer transition-colors group",
                    selectedPatient?.id === patient.id && "bg-clinical-50 dark:bg-clinical-900/20"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 font-bold group-hover:bg-clinical-200 dark:group-hover:bg-clinical-800 group-hover:text-clinical-700 transition-colors">
                      {patient.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-clinical-700 dark:group-hover:text-clinical-400 transition-colors">
                        {patient.name}
                      </h3>
                      <div className="flex flex-col gap-1 mt-0.5">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                          <Calendar size={10} />
                          Última visita: {format(patient.lastVisit, 'dd/MM/yyyy')}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                          {searchTerm && patient.history.find(h => 
                            h.procedure.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            h.notes.toLowerCase().includes(searchTerm.toLowerCase())
                          ) ? (
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-clinical-400" />
                              Encontrado: {patient.history.find(h => 
                                h.procedure.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                h.notes.toLowerCase().includes(searchTerm.toLowerCase())
                              )?.procedure}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 italic">
                              Último: {patient.history[0]?.procedure || 'Sem registros'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 dark:text-slate-700 group-hover:text-clinical-400 transition-transform group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center text-slate-400 dark:text-slate-600">
              <Users size={48} className="mx-auto mb-4 opacity-10" />
              <p className="font-medium">Nenhum paciente encontrado.</p>
            </div>
          )}
        </div>
      </div>

      {/* Patient Detail View */}
      <div className={cn(
        "flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors",
        !selectedPatient && "hidden lg:flex"
      )}>
        {selectedPatient ? (
          <div className="h-full flex flex-col">
            <div className="p-6 bg-slate-900 dark:bg-slate-950 text-white relative">
              <button 
                onClick={() => setSelectedPatient(null)}
                className="lg:hidden absolute top-4 left-4 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <ChevronRight size={18} className="rotate-180" />
              </button>
              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <div className="w-20 h-20 bg-clinical-500 rounded-3xl flex items-center justify-center text-3xl font-bold border-4 border-white/20 shadow-xl shadow-clinical-900/50">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Phone size={14} />
                      {selectedPatient.phone}
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Mail size={14} />
                      {selectedPatient.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <History size={20} className="text-clinical-600 dark:text-clinical-400" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Histórico Clínico</h3>
                  </div>
                </div>

                <div className="mb-8 p-5 bg-clinical-50/50 dark:bg-clinical-900/10 rounded-2xl border border-clinical-100 dark:border-clinical-800/50">
                  <p className="text-[10px] font-bold text-clinical-700 dark:text-clinical-400 uppercase tracking-widest mb-3">Novo Registro de Atendimento</p>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Procedimento / Título do atendimento"
                      value={newRecord.procedure}
                      onChange={(e) => setNewRecord({ ...newRecord, procedure: e.target.value })}
                      className="w-full px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-clinical-200 dark:border-clinical-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-200 dark:focus:ring-clinical-800 text-slate-800 dark:text-slate-200"
                    />
                    <textarea 
                      placeholder="Insira notas detalhadas sobre o procedimento, observações clínicas ou orientações dadas ao paciente..."
                      rows={3}
                      value={newRecord.notes}
                      onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                      className="w-full px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-clinical-200 dark:border-clinical-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-200 dark:focus:ring-clinical-800 resize-none font-sans text-slate-800 dark:text-slate-200"
                    />
                    <button 
                      onClick={handleAddRecord}
                      disabled={!newRecord.procedure.trim()}
                      className="w-full py-2 bg-clinical-600 text-white text-xs font-bold rounded-xl hover:bg-clinical-700 dark:hover:bg-clinical-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-clinical-200 dark:shadow-clinical-900/20"
                    >
                      Salvar no Prontuário
                    </button>
                  </div>
                </div>

                <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 pl-8 space-y-6 pt-2 pb-2">
                  {selectedPatient.history.map((h) => (
                    <div key={h.id} className="relative">
                      <div className="absolute -left-[2.35rem] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-clinical-600 dark:border-clinical-500 shadow-sm" />
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1">
                            {format(h.date, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{h.procedure}</h4>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                          {h.notes}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={20} className="text-clinical-600 dark:text-clinical-400" />
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Documentos e Exames</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-clinical-200 dark:hover:border-clinical-800 hover:bg-clinical-50 dark:hover:bg-clinical-900/10 transition-all cursor-pointer">
                    <Plus size={24} className="text-slate-300 dark:text-slate-700" />
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Anexar RX / PDF</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 bg-slate-50/30 dark:bg-slate-800/20">
              <button className="flex-1 py-3 px-4 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-200 dark:shadow-slate-950/50">
                Novo Procedimento
              </button>
              <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-200 dark:text-slate-700">
              <Users size={40} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Dados do Paciente</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                Selecione um paciente na lista ao lado para visualizar o prontuário completo, contatos e histórico clínico.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Basic New Patient Modal Placeholder */}
      {isAddingPatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl transition-colors">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Cadastro de Paciente</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Nome Completo</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-200 dark:focus:ring-clinical-800 text-slate-800 dark:text-slate-200" placeholder="Ex: João da Silva"/>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Telefone</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-200 dark:focus:ring-clinical-800 text-slate-800 dark:text-slate-200" placeholder="(11) 00000-0000"/>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsAddingPatient(false)}
                  className="flex-1 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => setIsAddingPatient(false)}
                  className="flex-1 py-3 text-sm font-bold text-white bg-clinical-600 rounded-xl shadow-lg shadow-clinical-200 dark:shadow-clinical-900/20 hover:bg-clinical-700"
                >
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
