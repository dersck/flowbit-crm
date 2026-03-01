import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Briefcase,
    CheckSquare,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    Settings,
    Users,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/AuthContext';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';

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
        void signOut(auth);
    };

    return (
        <aside
            className={cn(
                'sticky top-0 z-50 flex h-screen flex-col border-r border-slate-800 bg-slate-900 text-slate-300 transition-all duration-300',
                collapsed ? 'w-20' : 'w-64'
            )}
        >
            <div className="flex items-center gap-4 border-b border-slate-800/50 p-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 font-black text-white shadow-lg shadow-emerald-900/20 transition-transform hover:rotate-6">
                    {appUser?.displayName?.charAt(0) || 'F'}
                </div>
                {!collapsed ? (
                    <div className="animate-in slide-in-from-left-2 fade-in flex-1 overflow-hidden duration-300">
                        <h2 className="truncate text-sm font-black tracking-tight text-white">Flowbit CRM</h2>
                        <p className="truncate text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            {appUser?.email?.split('@')[0]}
                        </p>
                    </div>
                ) : null}
            </div>

            <nav className="scrollbar-hide flex-1 space-y-2 overflow-y-auto px-4 py-8">
                <p
                    className={cn(
                        'mb-4 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500',
                        collapsed && 'text-center'
                    )}
                >
                    {collapsed ? '...' : 'Menu Principal'}
                </p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                'group relative flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300',
                                isActive
                                    ? 'bg-emerald-600/10 font-bold text-emerald-400'
                                    : 'hover:bg-slate-800/50 hover:text-white'
                            )
                        }
                    >
                        <item.icon className={cn('h-5 w-5 transition-transform group-hover:scale-110', collapsed ? 'mx-auto' : '')} />
                        {!collapsed ? <span className="text-sm tracking-tight">{item.label}</span> : null}
                        {collapsed ? (
                            <div className="pointer-events-none absolute left-full z-[100] ml-4 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                                {item.label}
                            </div>
                        ) : null}
                    </NavLink>
                ))}
            </nav>

            <div className="space-y-2 border-t border-slate-800/50 bg-slate-900/50 p-4 backdrop-blur-md">
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        cn(
                            'group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300',
                            isActive
                                ? 'bg-slate-800 font-bold text-white'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        )
                    }
                >
                    <Settings className={cn('h-5 w-5', collapsed ? 'mx-auto' : '')} />
                    {!collapsed ? <span className="text-sm tracking-tight">Ajustes</span> : null}
                </NavLink>

                <Button
                    type="button"
                    variant="ghost"
                    onClick={handleLogout}
                    className="group h-auto w-full justify-start gap-3 rounded-2xl px-4 py-3 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                >
                    <LogOut className={cn('h-5 w-5', collapsed ? 'mx-auto' : 'group-hover:rotate-12')} />
                    {!collapsed ? <span className="text-sm font-bold tracking-tight">Cerrar sesion</span> : null}
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCollapsed((current) => !current)}
                    className="group mt-4 h-auto w-full justify-start gap-3 rounded-2xl border border-slate-800/50 bg-slate-800/30 px-4 py-3 text-slate-500 hover:bg-slate-800/80 hover:text-white"
                >
                    <div className={cn('flex flex-shrink-0 items-center justify-center transition-transform duration-500', collapsed && 'rotate-180')}>
                        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </div>
                    {!collapsed ? (
                        <span className="text-xs font-black uppercase tracking-widest opacity-60 transition-opacity group-hover:opacity-100">
                            Contraer Sidebar
                        </span>
                    ) : null}
                </Button>
            </div>
        </aside>
    );
}
