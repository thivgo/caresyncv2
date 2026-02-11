import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, HeartPulse, UserPlus, AlertTriangle } from 'lucide-react';

export const Signup: React.FC = () => {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(password.length < 3) {
        setError("A senha deve ter pelo menos 3 caracteres.");
        return;
    }
    setLoading(true);
    setError('');
    
    const result = await signup(name, email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || "Erro ao criar conta. Verifique sua conexão.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dot-pattern flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-200">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-[80px] animate-pulse"></div>
          <div className="absolute top-[20%] right-[10%] w-80 h-80 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="glass-card w-full max-w-[400px] rounded-3xl shadow-2xl shadow-blue-900/5 p-8 relative z-10 border-white/50 dark:border-slate-700/50 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-sm border border-gray-100 dark:border-slate-700">
             <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Criar Conta</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Comece a organizar o cuidado da sua família.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Nome Completo</label>
            <input 
              type="text" 
              required
              className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Senha</label>
            <input 
              type="password" 
              required
              placeholder="Mínimo 3 caracteres"
              className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-xs font-medium p-3 rounded-xl flex items-center gap-2 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="group w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20 hover:-translate-y-0.5 active:scale-95 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Cadastrar'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          Já tem conta?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Faça Login</Link>
        </p>
      </div>
    </div>
  );
};