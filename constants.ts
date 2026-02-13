import { ElderlyProfile, Task, TaskPriority, TaskStatus, TaskType, User } from './types';
import { 
  addHours, 
  startOfDay, 
  eachDayOfInterval, 
  startOfYear, 
  endOfYear, 
  isBefore, 
  isAfter, 
  isWeekend, 
  getDay, 
  setHours, 
  setMinutes,
  getDate
} from 'date-fns';

// --- USUÁRIOS (FAMÍLIA & PROFISSIONAIS) ---
export const MOCK_USERS: User[] = [
  {
    id: 'admin_user', // Mantido para compatibilidade com login
    name: 'Ana Maria (Filha)',
    email: 'admin', 
    password: 'admin',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnaMaria&backgroundColor=b6e3f4&hair=long&clothing=blazerAndShirt',
    role: 'ADMIN',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'u2',
    name: 'Carlos (Genro)',
    email: 'carlos@familia.com',
    password: '123',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos&backgroundColor=c0aede&facialHair=beardMedium',
    role: 'MEMBER',
    color: 'bg-emerald-100 text-emerald-800'
  },
  {
    // NOVO PERFIL: MARIANA (Substitui Júlia/Bia)
    id: 'u_mariana',
    name: 'Mariana (Neta)',
    email: 'mariana@familia.com',
    password: '123',
    // Avatar simplificado para garantir funcionamento
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana&backgroundColor=ffd5dc',
    role: 'MEMBER',
    color: 'bg-pink-100 text-pink-800'
  },
  {
    id: 'u4',
    name: 'Enf. Solange',
    email: 'solange@care.com',
    password: '123',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Solange&backgroundColor=d1d4f9&clothing=overall',
    role: 'MEMBER',
    color: 'bg-orange-100 text-orange-800'
  }
];

// --- IDOSOS ---
export const MOCK_ELDERLY: ElderlyProfile[] = [
  {
    id: 'e1',
    name: 'Vô Sebastião',
    gender: 'MALE',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sebastiao&backgroundColor=b6e3f4&facialHair=beardMajestic&clothing=shirtScoopNeck',
    conditions: ['Hipertensão', 'Diabetes Tipo 2'],
    notes: 'Precisa de ajuda para caminhar longas distâncias. Monitorar glicemia.'
  },
  {
    id: 'e2',
    name: 'Vó Alzira',
    gender: 'FEMALE',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alzira&backgroundColor=ffdfbf&hair=grayMedium&clothing=collarAndSweater',
    conditions: ['Alzheimer (Estágio Inicial)'],
    notes: 'Gosta de ouvir música clássica. Fica agitada no final da tarde.'
  },
  {
    id: 'e3',
    name: 'Tio Paulo',
    gender: 'MALE',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Paulo&backgroundColor=d1d4f9&glasses=round',
    conditions: ['Mobilidade Reduzida'],
    notes: 'Usa andador. Fisioterapia às terças e quintas.'
  }
];

// --- POOL DE TAREFAS ALEATÓRIAS ---
const RANDOM_TASKS_POOL = [
    { title: 'Comprar Fraldas Geriátricas', desc: 'Estoque do mês acabando.', type: TaskType.ACTIVITY, priority: TaskPriority.HIGH, hour: 10, assignee: 'admin_user' },
    { title: 'Cortar Cabelo', desc: 'Barbeiro vem em casa.', type: TaskType.HYGIENE, priority: TaskPriority.MEDIUM, hour: 14, assignee: 'u4' },
    { title: 'Trocar Curativo', desc: 'Pequeno corte no braço.', type: TaskType.HYGIENE, priority: TaskPriority.HIGH, hour: 11, assignee: 'u4' },
    { title: 'Visita do Primo Zé', desc: 'Vai passar a tarde para o café.', type: TaskType.ACTIVITY, priority: TaskPriority.LOW, hour: 15, assignee: null },
    { title: 'Consertar Cadeira de Banho', desc: 'Roda esquerda travando.', type: TaskType.ACTIVITY, priority: TaskPriority.HIGH, hour: 9, assignee: 'u2' },
    { title: 'Ligar para Farmácia', desc: 'Pedir entrega de analgésicos.', type: TaskType.ACTIVITY, priority: TaskPriority.MEDIUM, hour: 10, assignee: 'admin_user' },
    { title: 'Exame de Sangue', desc: 'Jejum de 8h necessário.', type: TaskType.APPOINTMENT, priority: TaskPriority.CRITICAL, hour: 7, assignee: 'admin_user' },
    { title: 'Tomar Vacina Gripe', desc: 'Campanha anual no posto.', type: TaskType.APPOINTMENT, priority: TaskPriority.HIGH, hour: 9, assignee: 'u2' },
    { title: 'Almoço de Aniversário', desc: 'Comemorar com a família toda.', type: TaskType.MEAL, priority: TaskPriority.MEDIUM, hour: 12, assignee: null },
    { title: 'Hidratar Pele', desc: 'Pele muito seca nas pernas.', type: TaskType.HYGIENE, priority: TaskPriority.MEDIUM, hour: 19, assignee: 'u4' },
    { title: 'Cortar Unhas', desc: 'Mãos e pés.', type: TaskType.HYGIENE, priority: TaskPriority.LOW, hour: 16, assignee: 'u4' },
    { title: 'Dentista (Emergência)', desc: 'Dor no dente molar.', type: TaskType.APPOINTMENT, priority: TaskPriority.CRITICAL, hour: 11, assignee: 'admin_user' }
];

// --- GERADOR DE TAREFAS PARA O ANO TODO ---
const generateYearlyTasks = (): Task[] => {
    const today = new Date();
    const yearStart = startOfYear(today);
    const yearEnd = endOfYear(today);
    
    // Gera todos os dias do ano
    const days = eachDayOfInterval({ start: yearStart, end: yearEnd });
    
    const tasks: Task[] = [];
    let taskIdCounter = 1;

    days.forEach((day) => {
        const isPast = isBefore(day, startOfDay(today));
        const isToday = day.toDateString() === today.toDateString();
        const dayOfWeek = getDay(day); // 0 = Dom, 1 = Seg, ...
        const dayOfMonth = getDate(day);

        // Helper para criar tarefa
        const addTask = (
            title: string, 
            desc: string, 
            elderlyId: string, 
            hour: number, 
            type: TaskType, 
            priority: TaskPriority, 
            assignedToId: string | null = null
        ) => {
            const scheduledDate = setMinutes(setHours(day, hour), 0);
            
            // Lógica de Status
            let status = TaskStatus.PENDING;
            let completedAt = undefined;

            if (isPast) {
                // 95% de chance de estar concluída no passado
                const isDone = Math.random() > 0.05; 
                status = isDone ? TaskStatus.COMPLETED : TaskStatus.SKIPPED;
                if (isDone) completedAt = addHours(scheduledDate, 0.5).toISOString();
            } else if (isToday) {
                // Tarefas de hoje: se a hora já passou, chance de estar feita
                if (hour < today.getHours()) {
                     status = TaskStatus.COMPLETED;
                     completedAt = addHours(scheduledDate, 0.2).toISOString();
                }
            }

            tasks.push({
                id: `auto_t_${taskIdCounter++}`,
                title,
                description: desc,
                elderlyId,
                assignedToId,
                createdBy: 'system',
                scheduledAt: scheduledDate.toISOString(),
                completedAt,
                status,
                priority,
                type
            });
        };

        // --- ROTINA DIÁRIA (Todos os dias) ---
        // Manhã
        addTask('Medir Glicemia', 'Anotar valor. Meta < 110.', 'e1', 7, TaskType.MEDICATION, TaskPriority.HIGH, 'admin_user');
        addTask('Café da Manhã', 'Mamão, aveia e torrada.', 'e1', 8, TaskType.MEAL, TaskPriority.MEDIUM, 'admin_user');
        addTask('Café da Manhã', 'Vitamina e remédios matinais.', 'e2', 8, TaskType.MEAL, TaskPriority.MEDIUM, 'u4');
        addTask('Remédio Pressão', 'Losartana 50mg.', 'e1', 9, TaskType.MEDICATION, TaskPriority.CRITICAL, 'e1');

        // Almoço
        addTask('Almoço em Família', 'Dieta hipossódica.', 'e1', 12, TaskType.MEAL, TaskPriority.MEDIUM);
        addTask('Almoço', 'Ajudar a cortar a carne.', 'e2', 12, TaskType.MEAL, TaskPriority.MEDIUM, 'u4');

        // Tarde
        addTask('Lanche da Tarde', 'Fruta ou iogurte.', 'e2', 15, TaskType.MEAL, TaskPriority.LOW);
        
        // Noite
        addTask('Banho Assistido', 'Cuidado com piso molhado.', 'e2', 18, TaskType.HYGIENE, TaskPriority.HIGH, 'u4');
        addTask('Jantar Leve', 'Sopa ou Caldo.', 'e1', 19, TaskType.MEAL, TaskPriority.MEDIUM, 'u2');
        addTask('Medicação Noturna', 'Antipsicótico prescrito.', 'e2', 20, TaskType.MEDICATION, TaskPriority.CRITICAL, 'admin_user');

        // --- ROTINAS SEMANAIS ---
        if (dayOfWeek === 2 || dayOfWeek === 4) { // Ter e Qui
            addTask('Sessão de Fisioterapia', 'Levar à clínica Santa Clara.', 'e3', 14, TaskType.APPOINTMENT, TaskPriority.HIGH, 'u2');
            addTask('Exercícios em Casa', 'Repetir série da fisio.', 'e3', 10, TaskType.ACTIVITY, TaskPriority.MEDIUM, 'e3');
        }

        if (isWeekend(day)) { // Sab e Dom
            // Atualizado para Mariana
            addTask('Passeio no Parque', 'Tomar sol e caminhar 20min.', 'e1', 16, TaskType.ACTIVITY, TaskPriority.MEDIUM, 'u_mariana');
            // Atualizado para Mariana
            addTask('Visita da Mariana', 'Jogar cartas ou conversar.', 'e2', 15, TaskType.ACTIVITY, TaskPriority.LOW, 'u_mariana');
        }

        if (dayOfWeek === 1 || dayOfWeek === 3) { // Seg e Qua
             addTask('Hidroginástica', 'Preparar bolsa com toalha.', 'e2', 9, TaskType.ACTIVITY, TaskPriority.MEDIUM, 'u4');
        }

        // --- ROTINAS MENSAIS ---
        if (dayOfMonth === 5) {
            addTask('Comprar Remédios do Mês', 'Verificar lista na geladeira.', 'e1', 10, TaskType.ACTIVITY, TaskPriority.HIGH, 'admin_user');
        }
        if (dayOfMonth === 15) {
            addTask('Cardiologista Dr. Silva', 'Levar exames recentes.', 'e1', 14, TaskType.APPOINTMENT, TaskPriority.CRITICAL, 'admin_user');
        }

        // --- TAREFAS ALEATÓRIAS (Realismo - 20% chance por dia) ---
        if (Math.random() < 0.20) {
            const randomTask = RANDOM_TASKS_POOL[Math.floor(Math.random() * RANDOM_TASKS_POOL.length)];
            // Escolhe um idoso aleatório para a tarefa
            const randomElderly = `e${Math.floor(Math.random() * 3) + 1}`;
            addTask(
                randomTask.title, 
                randomTask.desc, 
                randomElderly, 
                randomTask.hour, 
                randomTask.type, 
                randomTask.priority, 
                randomTask.assignee
            );
        }
    });

    return tasks;
};

// Gera as tarefas uma única vez ao carregar o módulo
export const INITIAL_TASKS: Task[] = generateYearlyTasks();