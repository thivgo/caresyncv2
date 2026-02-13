import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff, HeartPulse, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Falha ao entrar.');
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
      setEmail('admin');
      setPassword('admin');
  };

  return (
    <div className="min-h-screen bg-dot-pattern flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-200">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] left-[15%] w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[80px] animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[15%] w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="glass-card w-full max-w-[400px] rounded-3xl shadow-2xl shadow-blue-900/5 p-8 relative z-10 border-white/50 dark:border-slate-700/50 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60">
        
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
             <HeartPulse className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Bem-vindo de volta</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Cuide de quem importa, sem complicação.</p>
        </div>

        <div className="mb-6 relative group cursor-pointer" onClick={fillAdminCredentials}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-xl opacity-70 blur-[2px] group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-xl p-3 flex items-center justify-between shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">VERSÃO PARA TESTES</h3>
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono mt-0.5 space-x-2">
                            <span>User: <b>admin</b></span>
                            <span>Pass: <b>admin</b></span>
                        </div>
                    </div>
                </div>
                <button 
                    type="button"
                    className="text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
                >
                    Preencher
                </button>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Email ou Usuário</label>
            <input 
              type="text" 
              required
              placeholder="ex: admin"
              className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1">Senha</label>
            <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setShowPassword(!showPassword); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors p-1"
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-xs font-medium p-3 rounded-xl flex items-center gap-2 border border-red-100 dark:border-red-900/30 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="group w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <>
                  Entrar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          Não tem uma conta?{' '}
          <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
      
      <div className="absolute bottom-4 text-center w-full">
         <p className="text-[10px] text-gray-400 dark:text-gray-600 font-medium tracking-widest uppercase opacity-60">CareSync Family Serverless v2.1.0</p>
      </div>
    </div>
  );
};