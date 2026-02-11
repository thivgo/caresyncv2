import { ElderlyProfile, Task, TaskPriority, TaskStatus, TaskType, User } from './types';
import { addHours, startOfDay, addDays, subDays } from 'date-fns';

export const MOCK_USERS: User[] = [
  {
    id: 'admin_user',
    name: 'Admin Master',
    email: 'admin', 
    password: 'admin',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=b6e3f4',
    role: 'ADMIN',
    color: 'bg-slate-800 text-white'
  },
  {
    id: 'u1',
    name: 'Clara Silva',
    email: 'clara@exemplo.com',
    password: '123',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Clara&backgroundColor=c0aede',
    role: 'MEMBER',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'u2',
    name: 'Dr. Fernando',
    email: 'fernando@exemplo.com',
    password: '123',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fernando&backgroundColor=d1d4f9',
    role: 'ADMIN',
    color: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'u3',
    name: 'Júlia Costa',
    email: 'julia@exemplo.com',
    password: '123',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julia&backgroundColor=ffdfbf',
    role: 'MEMBER',
    color: 'bg-purple-100 text-purple-800'
  }
];

export const MOCK_ELDERLY: ElderlyProfile[] = [
  {
    id: 'e1',
    name: 'Vô Sebastião',
    gender: 'MALE',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sebastiao&backgroundColor=b6e3f4',
    conditions: ['Hipertensão', 'Diabetes Tipo 2'],
    notes: 'Precisa de ajuda para caminhar longas distâncias. Monitorar glicemia.'
  },
  {
    id: 'e2',
    name: 'Vó Alzira',
    gender: 'FEMALE',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alzira&backgroundColor=ffdfbf',
    conditions: ['Alzheimer (Estágio Inicial)'],
    notes: 'Gosta de ouvir música clássica. Fica agitada no final da tarde.'
  },
  {
    id: 'e3',
    name: 'Tio Paulo',
    gender: 'MALE',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Paulo&backgroundColor=d1d4f9',
    conditions: ['Mobilidade Reduzida'],
    notes: 'Usa andador. Fisioterapia às terças e quintas.'
  }
];

const today = startOfDay(new Date());

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Medir Glicemia',
    description: 'Anotar no caderno. Valor deve estar abaixo de 110.',
    elderlyId: 'e1',
    assignedToId: 'u1',
    createdBy: 'admin_user',
    scheduledAt: addHours(today, 7).toISOString(),
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.HIGH,
    type: TaskType.MEDICATION
  },
  {
    id: 't2',
    title: 'Café da Manhã',
    description: 'Mamão, aveia e torrada integral.',
    elderlyId: 'e2',
    assignedToId: 'admin_user',
    createdBy: 'admin_user',
    scheduledAt: addHours(today, 8).toISOString(),
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.MEDIUM,
    type: TaskType.MEAL
  },
  {
    id: 't3',
    title: 'Banho de Sol',
    description: '15 minutos no jardim se não estiver ventando.',
    elderlyId: 'e2',
    assignedToId: null,
    createdBy: 'u2',
    scheduledAt: addHours(today, 10).toISOString(),
    status: TaskStatus.PENDING,
    priority: TaskPriority.LOW,
    type: TaskType.ACTIVITY
  },
  {
    id: 't4',
    title: 'Almoço',
    description: 'Sopa de legumes e frango grelhado. Evitar sal.',
    elderlyId: 'e1',
    assignedToId: 'u3',
    createdBy: 'admin_user',
    scheduledAt: addHours(today, 12).toISOString(),
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    type: TaskType.MEAL
  },
  {
    id: 't5',
    title: 'Remédio Pressão (Losartana)',
    description: '50mg. Verificar se tomou com água.',
    elderlyId: 'e1',
    assignedToId: null,
    createdBy: 'admin_user',
    scheduledAt: addHours(today, 14).toISOString(),
    status: TaskStatus.PENDING,
    priority: TaskPriority.CRITICAL,
    type: TaskType.MEDICATION
  },
  {
    id: 't6',
    title: 'Fisioterapia',
    description: 'Acompanhar Tio Paulo até a clínica.',
    elderlyId: 'e3',
    assignedToId: 'u2',
    createdBy: 'admin_user',
    scheduledAt: addHours(today, 15).toISOString(),
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    type: TaskType.APPOINTMENT
  },
  {
    id: 't7',
    title: 'Banho Assistido',
    description: 'Usar cadeira de banho e sabonete neutro.',
    elderlyId: 'e2',
    assignedToId: 'u1',
    createdBy: 'u1',
    scheduledAt: addHours(today, 18).toISOString(),
    status: TaskStatus.PENDING,
    priority: TaskPriority.HIGH,
    type: TaskType.HYGIENE
  },
  {
    id: 't8',
    title: 'Consulta Cardiologista',
    description: 'Levar exames recentes. Dr. Silva às 09:30.',
    elderlyId: 'e1',
    assignedToId: 'admin_user',
    createdBy: 'admin_user',
    scheduledAt: addHours(addDays(today, 1), 9).toISOString(),
    status: TaskStatus.PENDING,
    priority: TaskPriority.CRITICAL,
    type: TaskType.APPOINTMENT
  },
  {
    id: 't9',
    title: 'Caminhada no Parque',
    description: 'Estimular movimento.',
    elderlyId: 'e3',
    assignedToId: null,
    createdBy: 'u2',
    scheduledAt: addHours(addDays(today, 1), 16).toISOString(),
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    type: TaskType.ACTIVITY
  },
  {
    id: 't10',
    title: 'Jantar Leve',
    description: 'Sopa.',
    elderlyId: 'e2',
    assignedToId: 'u1',
    createdBy: 'admin_user',
    scheduledAt: addHours(subDays(today, 1), 19).toISOString(),
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.MEDIUM,
    type: TaskType.MEAL
  }
];