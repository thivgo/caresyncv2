import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus, TaskType } from '../types';
import { useApp } from '../context/AppContext';
import { db } from '../services/dbService';
import { Avatar } from './ui/Avatar';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  Circle, 
  UserPlus, 
  Pill, 
  Utensils, 
  ShowerHead, 
  Activity, 
  CalendarClock,
  AlertCircle
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { users, elderlyProfiles, currentUser, refreshTasks } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  const elderly = elderlyProfiles.find(e => e.id === task.elderlyId);
  const assignee = users.find(u => u.id === task.assignedToId);
  
  const isAssignedToMe = task.assignedToId === currentUser.id;
  const isPending = task.status === TaskStatus.PENDING;

  const handleAssign = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProcessing(true);
    const newAssignee = isAssignedToMe ? null : currentUser.id;
    await db.assignTask(task.id, newAssignee);
    await refreshTasks();
    setIsProcessing(false);
  };

  const handleStatusToggle = async () => {
    if (!isAssignedToMe && task.assignedToId) return;
    
    setIsProcessing(true);
    const newStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;
    await db.updateTaskStatus(task.id, newStatus);
    await refreshTasks();
    setIsProcessing(false);
  };

  const getTypeIcon = () => {
    switch (task.type) {
      case TaskType.MEDICATION: return <Pill className="w-4 h-4 text-rose-500" />;
      case TaskType.MEAL: return <Utensils className="w-4 h-4 text-orange-500" />;
      case TaskType.HYGIENE: return <ShowerHead className="w-4 h-4 text-cyan-500" />;
      case TaskType.ACTIVITY: return <Activity className="w-4 h-4 text-emerald-500" />;
      default: return <CalendarClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = () => {
    if (task.status === TaskStatus.COMPLETED) return 'border-l-gray-300 dark:border-l-slate-600';
    switch (task.priority) {
      case TaskPriority.CRITICAL: return 'border-l-rose-500';
      case TaskPriority.HIGH: return 'border-l-orange-400';
      case TaskPriority.MEDIUM: return 'border-l-blue-400';
      default: return 'border-l-gray-300 dark:border-l-slate-600';
    }
  };

  return (
    <div className={`
      relative glass-card rounded-2xl p-4 shadow-sm border-l-[6px] mb-4 transition-all duration-300 group
      ${getPriorityColor()}
      ${task.status === TaskStatus.COMPLETED ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-lg hover:-translate-y-0.5'}
    `}>
      <div className="flex items-start justify-between gap-4">
        
        <button 
          onClick={handleStatusToggle}
          disabled={!task.assignedToId || (!isAssignedToMe && !!task.assignedToId) || isProcessing}
          className={`mt-1 transition-all active:scale-95 ${!task.assignedToId ? 'cursor-not-allowed opacity-30' : ''}`}
        >
          {task.status === TaskStatus.COMPLETED ? (
            <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-50 dark:fill-green-900/20 shadow-sm rounded-full" />
          ) : (
            <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-gray-100/80 dark:bg-slate-700/80 rounded-lg p-1.5 shadow-sm">
              {getTypeIcon()}
            </span>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {format(new Date(task.scheduledAt), 'HH:mm')} • {elderly?.name.split(' ')[0]}
            </span>
            {task.priority === TaskPriority.CRITICAL && (
               <span className="flex items-center text-[10px] font-extrabold text-white bg-rose-500 px-2 py-0.5 rounded-full shadow-sm shadow-rose-200 dark:shadow-none animate-pulse">
                 <AlertCircle className="w-3 h-3 mr-1" />
                 CRÍTICO
               </span>
            )}
          </div>
          
          <h3 className={`font-bold text-lg leading-tight text-gray-800 dark:text-gray-100 truncate ${task.status === TaskStatus.COMPLETED ? 'line-through decoration-gray-400 text-gray-500' : ''}`}>
            {task.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
            {task.description}
          </p>

          <div className="mt-4 pt-3 border-t border-gray-100/50 dark:border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
                {assignee ? (
                   <div className="flex items-center gap-2 bg-white dark:bg-slate-700/50 pr-3 pl-0.5 py-0.5 rounded-full border border-gray-100 dark:border-slate-600 shadow-sm">
                     <Avatar src={assignee.avatarUrl} alt={assignee.name} size="sm" className="w-6 h-6" />
                     <span className="text-xs text-gray-700 dark:text-gray-200 font-semibold">
                        {isAssignedToMe ? 'Eu' : assignee.name.split(' ')[0]}
                     </span>
                   </div>
                ) : (
                  <span className="text-xs text-gray-400 dark:text-gray-500 italic pl-1 font-medium">
                    -- Não atribuído --
                  </span>
                )}
            </div>

            {task.status !== TaskStatus.COMPLETED && (
              <button
                onClick={handleAssign}
                disabled={isProcessing}
                className={`
                  flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors
                  ${isAssignedToMe 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-300 dark:bg-red-900/30' 
                    : !assignee 
                      ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 shadow-sm'
                      : 'text-gray-400 dark:text-gray-600 cursor-default'
                  }
                `}
              >
                {isProcessing ? (
                  <span className="animate-pulse">...</span>
                ) : isAssignedToMe ? (
                  'Abandonar'
                ) : !assignee ? (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    Assumir
                  </>
                ) : (
                  ''
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};