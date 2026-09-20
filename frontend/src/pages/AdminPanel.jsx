import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AdminPanel() {
    const { user, token, authenticated } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [projects, setProjects] = useState([]);

    // Estado para el formulario de nueva lección
    const [newLesson, setNewLesson] = useState({
        lesson_number: "",
        title: "",
        hint_code: "",
    });

    // 1. VERIFICACIÓN DE SEGURIDAD (Redirigir si no es admin)
    useEffect(() => {
        if (authenticated && user && !user.is_admin) {
            navigate("/dashboard"); // Si es un alumno normal, lo expulsamos al panel
        }
    }, [user, authenticated, navigate]);

    // 2. CARGAR TODOS LOS DATOS
    const fetchData = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };

            const [usersRes, lessonsRes, projectsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/admin/users/`, { headers }),
                fetch(`${API_BASE_URL}/api/lessons/`),
                fetch(`${API_BASE_URL}/api/projects/`),
            ]);

            if (usersRes.ok) setUsers(await usersRes.json());
            if (lessonsRes.ok) setLessons(await lessonsRes.json());
            if (projectsRes.ok) setProjects(await projectsRes.json());
        } catch (err) {
            console.error("Error cargando datos del panel admin:", err);
        }
    };

    useEffect(() => {
        if (user?.is_admin) fetchData();
    }, [user]);

    // 3. FUNCIONES DE BORRADO (Llamadas a la API)
    const handleDeleteUser = async (id) => {
        if (
            !window.confirm("¿Borrar este usuario y TODAS sus pistas para siempre?")
        )
            return;
        const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) fetchData();
    };

    const handleDeleteLesson = async (id) => {
        if (!window.confirm("¿Borrar esta lección del temario oficial?")) return;
        const res = await fetch(`${API_BASE_URL}/api/admin/lessons/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) fetchData();
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm("¿Eliminar esta pista de la galería de la comunidad?"))
            return;
        const res = await fetch(`${API_BASE_URL}/api/admin/projects/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) fetchData();
    };

    // 4. FUNCIÓN PARA CREAR LECCIÓN
    const handleCreateLesson = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_BASE_URL}/api/admin/lessons/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newLesson),
        });
        if (res.ok) {
            setNewLesson({ lesson_number: "", title: "", hint_code: "" });
            fetchData(); // Recargamos la lista
            alert("¡Lección añadida al temario!");
        } else {
            alert("Error al crear la lección.");
        }
    };

    if (!user?.is_admin) return null; // Previene parpadeos antes de redirigir

    return (
        <div className="bg-[#0A0A0B] text-on-background font-body-md min-h-screen flex flex-col selection:bg-primary-container/30 selection:text-primary-container">
            <Header />

            <main className="w-full max-w-6xl mx-auto pt-32 px-6 pb-20 flex-grow">
                <div className="flex items-center gap-3 mb-8">
                    <span className="material-symbols-outlined text-[#00FF41] text-4xl">
                        admin_panel_settings
                    </span>
                    <h1 className="text-3xl font-black font-['Space_Grotesk'] uppercase tracking-widest">
                        Centro de Mando
                    </h1>
                </div>

                {/* PESTAÑAS DE NAVEGACIÓN */}
                <div className="flex gap-4 border-b border-[#00FF41]/20 mb-8">
                    {["users", "lessons", "projects"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 font-['Space_Grotesk'] uppercase tracking-widest font-bold text-sm transition-colors ${activeTab === tab
                                    ? "text-[#00FF41] border-b-2 border-[#00FF41]"
                                    : "text-slate-500 hover:text-slate-300"
                                }`}
                        >
                            {tab === "users"
                                ? "Usuarios"
                                : tab === "lessons"
                                    ? "Temario"
                                    : "Comunidad"}
                        </button>
                    ))}
                </div>

                {/* ─── PESTAÑA USUARIOS ─── */}
                {activeTab === "users" && (
                    <div className="bg-[#141416] border border-[#00FF41]/10 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#00FF41]/5 text-[#00FF41] font-mono text-xs uppercase">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Usuario</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Rol</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#00FF41]/5 text-slate-300">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono">{u.id}</td>
                                        <td className="p-4 font-bold">{u.username}</td>
                                        <td className="p-4">{u.email}</td>
                                        <td className="p-4">
                                            {u.is_admin ? (
                                                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs">
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded text-xs">
                                                    Alumno
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {!u.is_admin && (
                                                <button
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded transition-colors"
                                                    title="Borrar Alumno"
                                                >
                                                    <span className="material-symbols-outlined text-lg">
                                                        delete
                                                    </span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ─── PESTAÑA LECCIONES ─── */}
                {activeTab === "lessons" && (
                    <div className="space-y-8">
                        <div className="bg-[#141416] border border-[#00FF41]/10 rounded-lg p-6">
                            <h3 className="text-[#00FF41] font-['Space_Grotesk'] font-bold mb-4 uppercase tracking-widest text-sm">
                                Añadir Nueva Lección
                            </h3>
                            <form
                                onSubmit={handleCreateLesson}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <input
                                    required
                                    type="text"
                                    placeholder="Número (Ej: 15)"
                                    value={newLesson.lesson_number}
                                    onChange={(e) =>
                                        setNewLesson({
                                            ...newLesson,
                                            lesson_number: e.target.value,
                                        })
                                    }
                                    className="bg-[#0A0A0B] border border-slate-700 text-white rounded p-3 focus:border-[#00FF41] outline-none font-mono text-sm"
                                />
                                <input
                                    required
                                    type="text"
                                    placeholder="Título de la lección"
                                    value={newLesson.title}
                                    onChange={(e) =>
                                        setNewLesson({ ...newLesson, title: e.target.value })
                                    }
                                    className="bg-[#0A0A0B] border border-slate-700 text-white rounded p-3 focus:border-[#00FF41] outline-none font-mono text-sm"
                                />
                                <textarea
                                    required
                                    placeholder="Código Strudel inicial (hint_code)"
                                    value={newLesson.hint_code}
                                    onChange={(e) =>
                                        setNewLesson({ ...newLesson, hint_code: e.target.value })
                                    }
                                    className="bg-[#0A0A0B] border border-slate-700 text-white rounded p-3 focus:border-[#00FF41] outline-none font-mono text-sm md:col-span-2 h-32"
                                />
                                <button
                                    type="submit"
                                    className="bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 hover:bg-[#00FF41] hover:text-black font-bold uppercase text-xs py-3 rounded md:col-span-2 transition-all"
                                >
                                    Publicar Lección
                                </button>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {lessons
                                .sort(
                                    (a, b) =>
                                        parseInt(a.lesson_number) - parseInt(b.lesson_number),
                                )
                                .map((l) => (
                                    <div
                                        key={l.id}
                                        className="bg-[#141416] border border-slate-800 p-4 rounded-lg flex flex-col justify-between"
                                    >
                                        <div>
                                            <span className="text-[10px] text-[#00FF41] font-mono border border-[#00FF41]/30 px-2 py-0.5 rounded">
                                                Módulo {l.lesson_number}
                                            </span>
                                            <h4 className="font-bold text-white mt-2 mb-2">
                                                {l.title}
                                            </h4>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteLesson(l.id)}
                                            className="mt-4 text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1 uppercase transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">
                                                delete
                                            </span>{" "}
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* ─── PESTAÑA PROYECTOS COMUNIDAD ─── */}
                {activeTab === "projects" && (
                    <div className="bg-[#141416] border border-[#00FF41]/10 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#00FF41]/5 text-[#00FF41] font-mono text-xs uppercase">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Título de Pista</th>
                                    <th className="p-4">Autor</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#00FF41]/5 text-slate-300">
                                {projects.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono">{p.id}</td>
                                        <td className="p-4 font-bold">{p.title}</td>
                                        <td className="p-4 text-slate-400">
                                            @{p.owner?.username || "desc"}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDeleteProject(p.id)}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded transition-colors"
                                                title="Borrar Pista"
                                            >
                                                <span className="material-symbols-outlined text-lg">
                                                    delete
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
