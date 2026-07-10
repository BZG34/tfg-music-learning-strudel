import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            if (isLogin) {
                // ─── LÓGICA DE LOGIN ───
                // FastAPI OAuth2PasswordBearer exige que los datos se envíen como Formulario (URLSearchParams), no como JSON
                const formData = new URLSearchParams();
                formData.append('username', email); // En OAuth2, el campo de email se envía en la variable 'username'
                formData.append('password', password);

                const response = await fetch(`${API_BASE_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData,
                });

                if (!response.ok) throw new Error('Acceso denegado. Credenciales incorrectas.');

                const data = await response.json();

                // Guardamos el token y los datos del usuario en el navegador (Local Storage)
                localStorage.setItem('pams_token', data.access_token);
                localStorage.setItem('pams_user', JSON.stringify(data.user));

                // Redirigimos al Dashboard
                navigate('/dashboard');

            } else {
                // ─── LÓGICA DE REGISTRO ───
                // El registro sí usa JSON normal
                const response = await fetch(`${API_BASE_URL}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, username, password }),
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.detail || 'Error en el sistema de registro.');
                }

                // Si el registro va bien, cambiamos al modo Login y mostramos mensaje
                setSuccess('Identidad registrada en la red. Procede a autenticarte.');
                setIsLogin(true);
                setPassword('');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] flex flex-col justify-center items-center p-6 selection:bg-[#00FF41]/30 text-white relative overflow-hidden cyber-grid">

            {/* Botón volver */}
            <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-[#00FF41] transition-colors font-mono text-xs uppercase tracking-widest z-10">
                <span className="material-symbols-outlined text-sm">arrow_back</span> Volver atrás
            </Link>

            <div className="w-full max-w-md relative z-10">
                {/* Logo / Cabecera */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-black text-[#00FF41] tracking-widest font-['Space_Grotesk'] uppercase mb-2">PAMS</h1>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                        {isLogin ? '// Inicio de Sesión' : '// Registro de nueva usuario'}
                    </p>
                </div>

                {/* Panel principal */}
                <div className="bg-[#141416] border border-[#00FF41]/20 p-8 rounded-xl shadow-[0_0_30px_rgba(0,255,65,0.05)] relative">

                    {/* Esquinas decorativas */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#00FF41]"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#00FF41]"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#00FF41]"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#00FF41]"></div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Mensajes de feedback */}
                        {error && (
                            <div className="p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-mono rounded flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">warning</span> {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] text-xs font-mono rounded flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">check_circle</span> {success}
                            </div>
                        )}

                        {/* Input: Username (Solo en registro) */}
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Nombre de usuario</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-600 text-sm">badge</span>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-[#0A0A0B] border border-slate-800 text-white pl-9 pr-4 py-3 rounded focus:outline-none focus:border-[#00FF41]/50 focus:ring-1 focus:ring-[#00FF41]/50 font-mono text-sm transition-all"
                                        placeholder="ej: SynthMaster99"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Input: Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Email de acceso</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-600 text-sm">alternate_email</span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0A0A0B] border border-slate-800 text-white pl-9 pr-4 py-3 rounded focus:outline-none focus:border-[#00FF41]/50 focus:ring-1 focus:ring-[#00FF41]/50 font-mono text-sm transition-all"
                                    placeholder="admin@uah.es"
                                />
                            </div>
                        </div>

                        {/* Input: Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Contraseña</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-600 text-sm">lock</span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0A0A0B] border border-slate-800 text-white pl-9 pr-4 py-3 rounded focus:outline-none focus:border-[#00FF41]/50 focus:ring-1 focus:ring-[#00FF41]/50 font-mono text-sm transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Botón Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 mt-4 bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest rounded hover:bg-[#00FF41] hover:text-[#003907] transition-all disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <span className="material-symbols-outlined animate-spin text-sm">autorenew</span>
                            ) : (
                                <span className="material-symbols-outlined text-sm">login</span>
                            )}
                            {isLogin ? 'Iniciar Sesión' : 'Registrar Usuario'}
                        </button>
                    </form>
                </div>

                {/* Toggle Login/Registro */}
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setSuccess('');
                        }}
                        className="text-xs font-mono text-slate-500 hover:text-[#00FF41] transition-colors"
                    >
                        {isLogin ? '> ¿No tienes acceso? Regístrate aquí.' : '> ¿Ya estás registrado? Inicia sesión aquí.'}
                    </button>
                </div>
            </div>
        </div>
    );
}