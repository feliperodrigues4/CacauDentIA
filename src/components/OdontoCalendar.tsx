import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  startOfDay,
  addHours
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus, 
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Appointment {
  id: string;
  patient: string;
  procedure: string;
  start: Date;
  duration: number; // minutes
  status: 'scheduled' | 'confirmed' | 'completed';
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    patient: 'Ana Souza',
    procedure: 'Restauração Resina',
    start: addHours(startOfDay(new Date()), 9),
    duration: 60,
    status: 'completed'
  },
  {
    id: '2',
    patient: 'Carlos Lima',
    procedure: 'Canal (Endo)',
    start: addHours(startOfDay(new Date()), 10.5),
    duration: 90,
    status: 'confirmed'
  },
  {
    id: '3',
    patient: 'Beatriz Silva',
    procedure: 'Limpeza e Profilaxia',
    start: addHours(startOfDay(new Date()), 14),
    duration: 45,
    status: 'scheduled'
  },
  {
    id: '4',
    patient: 'Roberto Dias',
    procedure: 'Avaliação Implante',
    start: addHours(startOfDay(addDays(new Date(), 1)), 11),
    duration: 30,
    status: 'scheduled'
  }
];

type ViewType = 'month' | 'week' | 'day';

export const OdontoCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextPeriod = () => {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(addDays(currentDate, 7));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const prevPeriod = () => {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(addDays(currentDate, -7));
    else setCurrentDate(addDays(currentDate, -1));
  };

  const renderHeader = () => {
    const dateFormat = view === 'month' ? "MMMM yyyy" : "dd 'de' MMMM yyyy";
    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 capitalize">
            {format(currentDate, dateFormat, { locale: ptBR })}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Gerenciamento de agenda clínica</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm transition-colors">
          {(['day', 'week', 'month'] as ViewType[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                view === v 
                  ? "bg-clinical-600 text-white shadow-md shadow-clinical-200" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              {v === 'day' ? 'Dia' : v === 'week' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={prevPeriod} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
            <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
          <button 
            onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors"
          >
            Hoje
          </button>
          <button onClick={nextPeriod} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
            <ChevronRight size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
          <button className="ml-2 flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 dark:hover:bg-white transition-all shadow-lg shadow-slate-200 dark:shadow-slate-950/50">
            <Plus size={16} />
            Agendar
          </button>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800">
          {weekDays.map(day => (
            <div key={day} className="py-4 text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-800/50">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            const dailyApps = MOCK_APPOINTMENTS.filter(app => isSameDay(app.start, day));

            return (
              <div 
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "min-h-[120px] p-2 border-r border-b border-slate-100 dark:border-slate-800 transition-all cursor-pointer relative",
                  !isCurrentMonth ? "bg-slate-50/30 dark:bg-slate-800/10 text-slate-300 dark:text-slate-700" : "text-slate-700 dark:text-slate-300 hover:bg-clinical-50/30 dark:hover:bg-clinical-900/10",
                  isSelected && "bg-clinical-50 dark:bg-clinical-900/20 ring-2 ring-inset ring-clinical-200 dark:ring-clinical-800 z-10"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold transition-all",
                    isToday ? "bg-clinical-600 text-white shadow-sm" : "text-slate-500 dark:text-slate-400"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dailyApps.length > 0 && isCurrentMonth && (
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full text-slate-500 dark:text-slate-400 font-bold">
                      {dailyApps.length}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dailyApps.slice(0, 2).map(app => (
                    <div key={app.id} className="text-[10px] p-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm truncate font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1 transition-colors">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full flex-shrink-0",
                        app.status === 'completed' ? "bg-emerald-400" : "bg-clinical-400"
                      )} />
                      {format(app.start, 'HH:mm')} {app.patient}
                    </div>
                  ))}
                  {dailyApps.length > 2 && (
                    <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold pl-1 italic">
                      + {dailyApps.length - 2} mais...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 to 20:00
    const dayAppointments = MOCK_APPOINTMENTS.filter(app => isSameDay(app.start, currentDate));

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row h-[700px] transition-colors">
        {/* Left Column: Hours */}
        <div className="w-full md:w-24 bg-slate-50/50 dark:bg-slate-800/30 border-r border-slate-100 dark:border-slate-800 pt-8 transition-colors">
          {hours.map(hour => (
            <div key={hour} className="h-20 flex flex-col items-center justify-start pt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              {hour}:00
            </div>
          ))}
        </div>
        
        {/* Right Column: Appointments Grid */}
        <div className="flex-1 relative overflow-y-auto p-4 md:p-8 bg-white dark:bg-slate-900 transition-colors">
          <div className="absolute inset-0 grid grid-rows-[repeat(13,5rem)] pointer-events-none px-4 md:px-8">
            {hours.map(hour => (
              <div key={hour} className="border-b border-slate-100 dark:border-slate-800/50 w-full last:border-0" />
            ))}
          </div>

          <div className="relative h-[1040px]">
            {dayAppointments.map(app => {
              const startHour = app.start.getHours() + app.start.getMinutes() / 60;
              const top = (startHour - 8) * 80; // 5rem = 80px
              const height = (app.duration / 60) * 80;

              return (
                <div 
                  key={app.id} 
                  style={{ top, height }}
                  className={cn(
                    "absolute left-0 right-0 p-3 rounded-2xl border flex flex-col justify-center transition-all hover:scale-[1.01] hover:shadow-lg cursor-pointer group",
                    app.status === 'completed' 
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300" 
                      : "bg-clinical-50 dark:bg-clinical-900/20 border-clinical-100 dark:border-clinical-800/50 text-clinical-800 dark:text-clinical-300 shadow-md shadow-clinical-100 dark:shadow-clinical-950/20"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                       {app.status === 'completed' && <CheckCircle2 size={12} className="text-emerald-500" />}
                       <span className="text-xs font-bold uppercase tracking-wider">{app.procedure}</span>
                    </div>
                    <span className="text-[10px] font-bold opacity-60 flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Clock size={10} />
                      {format(app.start, 'HH:mm')} - {format(addDays(app.start, app.duration / (24*60)), 'HH:mm')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white/50 dark:bg-slate-800/50 flex items-center justify-center">
                      <User size={14} className="opacity-70 dark:text-white" />
                    </div>
                    <span className="text-sm font-bold">{app.patient}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Sidebar (Desktop) */}
        <div className="hidden lg:block w-72 border-l border-slate-100 dark:border-slate-800 p-6 bg-slate-50/20 dark:bg-slate-800/10 transition-colors">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Resumo do Dia</h4>
          <div className="space-y-4">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Total Procedimentos</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{dayAppointments.length}</span>
                <Stethoscope size={20} className="text-clinical-400 dark:text-clinical-500" />
              </div>
            </div>
            
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">Tempo Estimado</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {Math.floor(dayAppointments.reduce((acc, curr) => acc + curr.duration, 0) / 60)}h{' '}
                  {dayAppointments.reduce((acc, curr) => acc + curr.duration, 0) % 60}m
                </span>
                <Clock size={20} className="text-clinical-400 dark:text-clinical-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderHeader()}
      {view === 'month' ? renderMonthView() : renderDayView()}
      
      {view === 'week' && (
        <div className="p-20 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 dark:text-slate-500 font-medium transition-colors">
          <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
          <p>A visualização semanal está sendo otimizada.</p>
          <button onClick={() => setView('month')} className="mt-4 text-clinical-600 dark:text-clinical-400 font-bold text-sm">Voltar para Mês</button>
        </div>
      )}
    </div>
  );
};
