import { MOCK_ELDERLY, MOCK_USERS, INITIAL_TASKS } from '../constants';
import { Task, User, ElderlyProfile, ActionResponse, TaskStatus, Role } from '../types';

// ATENÇÃO: Alterado para v10 para apagar totalmente o registro da Júlia/Bia e carregar a Mariana
const STORAGE_KEY_TASKS = 'caresync_tasks_v10';
const STORAGE_KEY_USERS = 'caresync_users_v10';
const STORAGE_KEY_ELDERLY = 'caresync_elderly_v10'; 
const STORAGE_KEY_SESSION = 'caresync_session_v10';

const channel = new BroadcastChannel('caresync_realtime_channel');
const notifyChange = (entity: 'TASKS' | 'USERS' | 'PROFILES') => {
    channel.postMessage({ type: 'DB_UPDATE', entity });
};

const initStorage = () => {
    let usersStr = localStorage.getItem(STORAGE_KEY_USERS);
    if (!usersStr) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(MOCK_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEY_ELDERLY)) {
        localStorage.setItem(STORAGE_KEY_ELDERLY, JSON.stringify(MOCK_ELDERLY));
    }
    if (!localStorage.getItem(STORAGE_KEY_TASKS)) {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(INITIAL_TASKS));
    }
};

const localData = {
    users: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]'),
    elderly: (): ElderlyProfile[] => JSON.parse(localStorage.getItem(STORAGE_KEY_ELDERLY) || '[]'),
    tasks: (): Task[] => JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS) || '[]'),
};

const localSave = {
    users: (d: User[]) => { localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(d)); notifyChange('USERS'); },
    elderly: (d: ElderlyProfile[]) => { localStorage.setItem(STORAGE_KEY_ELDERLY, JSON.stringify(d)); notifyChange('PROFILES'); },
    tasks: (d: Task[]) => { localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(d)); notifyChange('TASKS'); },
};

if (typeof window !== 'undefined') initStorage();

export const db = {
  subscribeToChanges: (callback: () => void) => {
      const handler = (event: MessageEvent) => {
          if (event.data?.type === 'DB_UPDATE') callback();
      };
      channel.addEventListener('message', handler);
      return () => channel.removeEventListener('message', handler);
  },

  login: async (email: string, password?: string): Promise<ActionResponse<User>> => {
    await new Promise(r => setTimeout(r, 600));
    
    const users = localData.users();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.email.split('@')[0] === email.toLowerCase());
    
    if (!user) return { success: false, error: 'Usuário não encontrado.' };
    if (user.password !== password) return { success: false, error: 'Senha incorreta.' };
    
    localStorage.setItem(STORAGE_KEY_SESSION, user.id);
    return { success: true, data: user };
  },

  signup: async (name: string, email: string, password: string): Promise<ActionResponse<User>> => {
    await new Promise(r => setTimeout(r, 600));
    const users = localData.users();
    if (users.find(u => u.email === email)) return { success: false, error: 'Email já cadastrado.' };

    const newUser: User = {
        id: `u${Date.now()}`,
        name,
        email,
        password,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`,
        role: users.length === 0 ? 'ADMIN' : 'MEMBER',
        color: 'bg-indigo-100 text-indigo-800'
    };
    localSave.users([...users, newUser]);
    localStorage.setItem(STORAGE_KEY_SESSION, newUser.id);
    return { success: true, data: newUser };
  },

  getCurrentUser: async (): Promise<User | null> => {
    const id = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!id) return null;
    return localData.users().find(u => u.id === id) || null;
  },

  logout: async () => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  },

  getUsers: async (): Promise<User[]> => {
    return localData.users();
  },

  getTasks: async (): Promise<Task[]> => {
    return localData.tasks();
  },

  getElderlyProfiles: async (): Promise<ElderlyProfile[]> => {
    return localData.elderly();
  },

  createTask: async (task: Task): Promise<ActionResponse<Task>> => {
    const tasks = localData.tasks();
    const newTask = { ...task, id: task.id || `t${Date.now()}` };
    localSave.tasks([...tasks, newTask]);
    return { success: true, data: newTask };
  },

  assignTask: async (taskId: string, userId: string | null): Promise<ActionResponse<Task>> => {
    const tasks = localData.tasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return { success: false, error: 'Task not found' };
    tasks[index] = { ...tasks[index], assignedToId: userId };
    localSave.tasks(tasks);
    return { success: true, data: tasks[index] };
  },

  updateTaskStatus: async (taskId: string, status: TaskStatus): Promise<ActionResponse<Task>> => {
    const tasks = localData.tasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return { success: false, error: 'Task not found' };
    tasks[index] = { 
      ...tasks[index], 
      status,
      completedAt: status === TaskStatus.COMPLETED ? new Date().toISOString() : undefined
    };
    localSave.tasks(tasks);
    return { success: true, data: tasks[index] };
  },

  deleteTask: async (taskId: string): Promise<ActionResponse<void>> => {
      const tasks = localData.tasks().filter(t => t.id !== taskId);
      localSave.tasks(tasks);
      return { success: true };
  },

  createElderlyProfile: async (profile: ElderlyProfile): Promise<ActionResponse<ElderlyProfile>> => {
      const list = localData.elderly();
      const newProfile = { ...profile, id: profile.id || `e${Date.now()}` };
      localSave.elderly([...list, newProfile]);
      return { success: true, data: newProfile };
  },

  deleteElderlyProfile: async (id: string): Promise<ActionResponse<void>> => {
      const list = localData.elderly().filter(e => e.id !== id);
      localSave.elderly(list);
      
      const tasks = localData.tasks().filter(t => t.elderlyId !== id);
      localSave.tasks(tasks);
      
      return { success: true };
  },

  updateUserRole: async (userId: string, newRole: Role): Promise<ActionResponse<User>> => {
    const users = localData.users();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return { success: false, error: 'User not found' };
    const updatedUser = { ...users[index], role: newRole };
    const newUsers = [...users];
    newUsers[index] = updatedUser;
    localSave.users(newUsers);
    return { success: true, data: updatedUser };
  },

  deleteUser: async (userId: string): Promise<ActionResponse<void>> => {
    const users = localData.users().filter(u => u.id !== userId);
    localSave.users(users);
    
    const tasks = localData.tasks().map(t => 
        t.assignedToId === userId ? { ...t, assignedToId: null } : t
    );
    localSave.tasks(tasks);
    return { success: true };
  }
};