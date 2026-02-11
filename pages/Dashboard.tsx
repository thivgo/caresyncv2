import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DateStrip } from '../components/DateStrip';
import { TaskCard } from '../components/TaskCard';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { MonthCalendar } from '../components/MonthCalendar'; 
import { isSameDay, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, CalendarDays, ChevronUp, Sparkles } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { tasks, isLoading, currentUser } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMonthView, setShowMonthView] = useState(false);

  const dailyTasks = useMemo(() => {
    return tasks.filter(task => isSameDay(new Date(task.scheduledAt), selectedDate));
  }, [tasks, selectedDate]);

  const progress = useMemo(() => {
    if (dailyTasks.length === 0) return 0;
    const completed = dailyTasks.filter(t => t.status === 'COMPLETED').length;
    return Math.round((completed / dailyTasks.length) * 100);
  }, [dailyTasks]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-600 font-medium animate-pulse">Carregando sua agenda...</div>;
  }

  return (
    <>
      <div className="md:hidden">
        <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      <div className="hidden md:block mb-6">
           <div className="flex items-center justify-between">
               <div>
                   <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Olá, {currentUser?.name.split(' ')[0]} 👋</h2>
                   <p className="text-gray-500 dark:text-gray-400">Aqui está o cronograma de cuidados para hoje.</p>
               </div>
               <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-lg shadow-blue-500/30 font-semibold flex items-center gap-2 transition-all active:scale-95"
               >
                   <Plus className="w-5 h-5" /> Nova Tarefa
               </button>
           </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="px-4 mt-2 md:hidden">
                <button 
                  onClick={() => setShowMonthView(!showMonthView)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wide bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                >
                    {showMonthView ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Ocultar Calendário
                        </>
                    ) : (
                        <>
                          <CalendarDays className="w-4 h-4" />
                          Ver Calendário Mensal
                        </>
                    )}
                </button>

                {showMonthView && (
                    <div className="mt-2 mb-4">
                        <MonthCalendar 
                          selectedDate={selectedDate} 
                          onSelectDate={setSelectedDate} 
                          tasks={tasks}
                        />
                    </div>
                )}
            </div>

            <div className="px-4 md:px-0">
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 mb-8 transition-all hover:scale-[1.01]">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-900 opacity-20 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold capitalize flex items-center gap-2">
                                    {format(selectedDate, "EEEE", { locale: ptBR })}
                                    {progress === 100 && <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />}
                                </h2>
                                <p className="text-blue-100 text-sm font-medium opacity-90">
                                    {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
                                </p>
                            </div>
                            <div className="text-4xl font-extrabold tracking-tighter">{progress}%</div>
                        </div>
                        
                        <div className="flex justify-between text-xs font-medium text-blue-100 mb-2 opacity-80">
                            <span>Progresso Diário</span>
                            <span>{dailyTasks.filter(t => t.status === 'COMPLETED').length}/{dailyTasks.length} Tarefas</span>
                        </div>
                        
                        <div className="w-full bg-black/20 rounded-full h-3 backdrop-blur-sm p-0.5">
                            <div 
                                className="bg-white h-2 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Cronograma
                    </h3>
                    <span className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-500 px-2 py-1 rounded-md font-medium">
                        {dailyTasks.length} itens
                    </span>
                </div>
                
                <div className="space-y-1 pb-20 md:pb-0">
                    {dailyTasks.length > 0 ? (
                        dailyTasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 glass-card rounded-2xl border-dashed border-2 border-gray-200 dark:border-slate-700">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                <CalendarDays className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-gray-500 font-medium">Dia livre!</p>
                            <p className="text-xs text-gray-400 mb-4">Nenhuma tarefa agendada.</p>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline"
                            >
                                + Adicionar primeira tarefa
                            </button>
                        </div>
                    )}
                </div>
            </div>
          </div>

          <div className="hidden lg:block space-y-6">
              <MonthCalendar 
                selectedDate={selectedDate} 
                onSelectDate={setSelectedDate} 
                tasks={tasks}
              />
              
              <div className="glass-card p-5 rounded-2xl">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-3 text-sm">Resumo Rápido</h4>
                  <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">Concluídas</span>
                          <span className="text-lg font-bold text-green-700 dark:text-green-300">
                              {tasks.filter(t => t.status === 'COMPLETED' && isSameDay(new Date(t.scheduledAt), selectedDate)).length}
                          </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-900/30">
                          <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Pendentes</span>
                          <span className="text-lg font-bold text-orange-700 dark:text-orange-300">
                               {tasks.filter(t => t.status !== 'COMPLETED' && isSameDay(new Date(t.scheduledAt), selectedDate)).length}
                          </span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
      <button 
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl shadow-blue-600/40 flex items-center justify-center active:scale-90 transition-all z-40"
        aria-label="Add Task"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-7 h-7" />
      </button>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedDate={selectedDate}
      />
    </>
  );
};