import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TaskCard } from '../components/TaskCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Trash2, Search, Calendar, ChevronDown, Clock, History, ChevronRight } from 'lucide-react';
import { TaskStatus } from '../types';
import { format, isToday, isTomorrow, isYesterday, parseISO, startOfDay, isBefore, isAfter, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DAYS_PER_PAGE = 10;

export const Tasks: React.FC = () => {
  const { tasks, deleteTask, currentUser } = useApp();
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [timeFilter, setTimeFilter] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [search, setSearch] = useState('');
  
  // Pagination / Deletion / UI State
  const [displayCount, setDisplayCount] = useState(DAYS_PER_PAGE);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [collapsedDates, setCollapsedDates] = useState<Record<string, boolean>>({});

  // 1. Filter Tasks (Memoized)
  const filteredTasks = useMemo(() => {
    const today = startOfDay(new Date());

    return tasks.filter(task => {
        const taskDate = new Date(task.scheduledAt);
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
        
        // Status Filter
        const matchesStatus = statusFilter === 'ALL' 
          ? true 
          : statusFilter === 'PENDING' 
              ? task.status !== TaskStatus.COMPLETED 
              : task.status === TaskStatus.COMPLETED;

        // Time Filter (Critical for Performance)
        // Note: For UPCOMING, we include today. For PAST, strictly before today.
        const matchesTime = timeFilter === 'UPCOMING'
           ? !isBefore(taskDate, today) // Today and Future
           : isBefore(taskDate, today); // Strictly Past

        return matchesSearch && matchesStatus && matchesTime;
    });
  }, [tasks, search, statusFilter, timeFilter]);

  // 2. Group by Date Key (YYYY-MM-DD)
  const groupedTasks = useMemo(() => {
    return filteredTasks.reduce((acc, task) => {
        const dateKey = task.scheduledAt.split('T')[0];
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(task);
        return acc;
    }, {} as Record<string, typeof tasks>);
  }, [filteredTasks]);

  // 3. Sort Dates & Paginate
  const visibleDates = useMemo(() => {
      const allDates = Object.keys(groupedTasks);
      
      // Sort logic depends on Time Filter
      // UPCOMING: Ascending (Today -> Future)
      // PAST: Descending (Yesterday -> History)
      allDates.sort((a, b) => {
          return timeFilter === 'UPCOMING' 
            ? a.localeCompare(b) 
            : b.localeCompare(a);
      });

      return allDates.slice(0, displayCount);
  }, [groupedTasks, timeFilter, displayCount]);

  const hasMore = visibleDates.length < Object.keys(groupedTasks).length;

  const handleLoadMore = () => {
      setDisplayCount(prev => prev + DAYS_PER_PAGE);
  };

  const handleTimeFilterChange = (filter: 'UPCOMING' | 'PAST') => {
      setTimeFilter(filter);
      setDisplayCount(DAYS_PER_PAGE); // Reset pagination on filter switch
      setCollapsedDates({}); // Reset collapsed state when switching views
  };

  const toggleDate = (dateKey: string) => {
      setCollapsedDates(prev => ({
          ...prev,
          [dateKey]: !prev[dateKey]
      }));
  };

  const confirmDelete = async () => {
      if (deleteId) {
          await deleteTask(deleteId);
          setDeleteId(null);
      }
  };

  const getDateLabel = (dateStr: string) => {
      const date = parseISO(dateStr);
      if (isToday(date)) return 'Hoje';
      if (isTomorrow(date)) return 'Amanhã';
      if (isYesterday(date)) return 'Ontem';
      return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gerenciar Tarefas</h2>
            <span className="text-xs font-mono bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-gray-500">
                {filteredTasks.length} tarefas
            </span>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Buscar tarefas..." 
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
               {/* Time Filters */}
               <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
                    <button 
                        onClick={() => handleTimeFilterChange('UPCOMING')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeFilter === 'UPCOMING' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        <Clock className="w-3.5 h-3.5" /> Próximas
                    </button>
                    <button 
                        onClick={() => handleTimeFilterChange('PAST')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeFilter === 'PAST' ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-600 dark:text-purple-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        <History className="w-3.5 h-3.5" /> Histórico
                    </button>
               </div>

               {/* Status Filters */}
               <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
                   <button 
                     onClick={() => setStatusFilter('ALL')}
                     className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${statusFilter === 'ALL' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                   >
                     Todas
                   </button>
                   <button 
                     onClick={() => setStatusFilter('PENDING')}
                     className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${statusFilter === 'PENDING' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                   >
                     Pendentes
                   </button>
                   <button 
                     onClick={() => setStatusFilter('COMPLETED')}
                     className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${statusFilter === 'COMPLETED' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                   >
                     Feitas
                   </button>
                </div>
            </div>
          </div>
      </div>

      <div className="space-y-4 min-h-[300px]">
          {visibleDates.length > 0 ? (
              <>
                {visibleDates.map(dateKey => {
                    const isCollapsed = collapsedDates[dateKey];
                    const dayTasks = groupedTasks[dateKey];
                    const isCurrentDay = isToday(parseISO(dateKey));

                    return (
                        <div key={dateKey} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* Date Header - Now Clickable */}
                            <button 
                                onClick={() => toggleDate(dateKey)}
                                className={`
                                    w-full flex items-center justify-between gap-3 mb-2 sticky top-0 z-10 py-3 px-4 rounded-xl border transition-all duration-200 group
                                    ${isCurrentDay 
                                        ? 'bg-blue-50/95 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 backdrop-blur-sm' 
                                        : 'bg-white/95 dark:bg-slate-800/95 border-gray-100 dark:border-slate-700 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-slate-700/80'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-lg transition-transform duration-300 ${isCollapsed ? '-rotate-90' : 'rotate-0'} ${isCurrentDay ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 dark:bg-slate-700 text-gray-500'}`}>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h3 className={`text-sm font-bold uppercase tracking-wider ${isCurrentDay ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {getDateLabel(dateKey)}
                                        </h3>
                                        {isCollapsed && (
                                            <span className="text-xs bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">
                                                {dayTasks.length} tarefas
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {!isCollapsed && (
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        Ocultar
                                    </span>
                                )}
                            </button>
                            
                            {/* Tasks List - Collapsible */}
                            {!isCollapsed && (
                                <div className="space-y-3 pl-2 border-l-2 border-gray-100 dark:border-slate-800 ml-5 animate-in slide-in-from-top-2 fade-in duration-300 origin-top">
                                    {dayTasks.map(task => (
                                        <div key={task.id} className="group relative pl-4">
                                            <TaskCard task={task} />
                                            {/* Admin Delete Button */}
                                            {(currentUser?.role === 'ADMIN' || currentUser?.id === task.createdBy) && (
                                                <button 
                                                    onClick={() => setDeleteId(task.id)}
                                                    className="absolute top-4 right-2 p-2 bg-white dark:bg-slate-700 text-gray-300 hover:text-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-gray-100 dark:border-slate-600 z-10"
                                                    title="Excluir tarefa"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {hasMore && (
                    <button 
                        onClick={handleLoadMore}
                        className="w-full py-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md mt-4"
                    >
                        <ChevronDown className="w-4 h-4" />
                        Carregar mais datas
                    </button>
                )}
              </>
          ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 animate-bounce">
                      <Search className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">Nada encontrado</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mt-1">
                      Nenhuma tarefa encontrada para o filtro 
                      <strong className="text-blue-500 mx-1">
                          {timeFilter === 'UPCOMING' ? 'Próximas' : 'Histórico'}
                      </strong> 
                      com os critérios atuais.
                  </p>
                  {timeFilter === 'UPCOMING' && (
                      <button 
                        onClick={() => handleTimeFilterChange('PAST')}
                        className="mt-6 text-sm font-bold text-blue-600 hover:underline"
                      >
                          Ver Histórico Antigo
                      </button>
                  )}
              </div>
          )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Excluir Tarefa"
        description="Tem certeza que deseja remover esta tarefa permanentemente?"
        confirmText="Excluir"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};