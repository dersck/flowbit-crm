import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    CheckSquare,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Clientes', path: '/clients' },
    { icon: Briefcase, label: 'Proyectos', path: '/projects' },
    { icon: CheckSquare, label: 'Tareas', path: '/tasks' },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { appUser } = useAuth();

    const handleLogout = () => {
        signOut(auth);
    };

    return (
        <aside className={cn(
            "sticky top-0 h-screen bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col border-r border-slate-800 z-50",
            collapsed ? "w-20" : "w-64"
        )}>
            {/* Workspace Switcher */}
            <div className="p-6 flex items-center gap-4 border-b border-slate-800/50">
                <div className="h-10 w-10 flex-shrink-0 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-900/20 transform hover:rotate-6 transition-transform">
                    {appUser?.displayName?.charAt(0) || 'F'}
                </div>
                {!collapsed && (
                    <div className="flex-1 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                        <h2 className="text-sm font-black text-white truncate tracking-tight">Flowbit CRM</h2>
                        <p className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-widest">{appUser?.email?.split('@')[0]}</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto scrollbar-hide">
                <p className={cn("text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-4", collapsed && "text-center")}>
                    {collapsed ? '•••' : 'Menú Principal'}
                </p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                            isActive
                                ? "bg-emerald-600/10 text-emerald-400 font-bold"
                                : "hover:bg-slate-800/50 hover:text-white"
                        )}
                    >
                        <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", collapsed ? "mx-auto" : "")} />
                        {!collapsed && <span className="text-sm tracking-tight">{item.label}</span>}
                        {collapsed && (
                            <div className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none shadow-xl border border-slate-700">
                                {item.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-md space-y-2">
                <NavLink
                    to="/settings"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                        isActive
                            ? "bg-slate-800 text-white font-bold"
                            : "hover:bg-slate-800/50 hover:text-white text-slate-400"
                    )}
                >
                    <Settings className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
                    {!collapsed && <span className="text-sm tracking-tight">Ajustes</span>}
                </NavLink>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 transition-all group"
                >
                    <LogOut className={cn("h-5 w-5 transition-transform group-hover:rotate-12", collapsed ? "mx-auto" : "")} />
                    {!collapsed && <span className="text-sm font-bold tracking-tight">Cerrar sesión</span>}
                </button>

                {/* Redesigned Collapse Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-800/30 border border-slate-800/50 text-slate-500 hover:text-white hover:bg-slate-800/80 transition-all group"
                >
                    <div className={cn("flex-shrink-0 flex items-center justify-center transition-transform duration-500", collapsed && "transform rotate-180")}>
                        {collapsed ? <ChevronRight className="h-5 w-5 mx-auto" /> : <ChevronLeft className="h-5 w-5 mx-auto" />}
                    </div>
                    {!collapsed && <span className="text-xs font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Contraer Sidebar</span>}
                </button>
            </div>
        </aside>
    );
}
