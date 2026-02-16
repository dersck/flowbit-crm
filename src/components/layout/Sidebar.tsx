import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    CheckSquare,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
            "h-screen bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col border-r border-slate-800",
            collapsed ? "w-20" : "w-64"
        )}>
            {/* Workspace Switcher Placeholder */}
            <div className="p-4 flex items-center gap-3 border-b border-slate-800">
                <div className="h-10 w-10 flex-shrink-0 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                    {appUser?.displayName?.charAt(0) || 'F'}
                </div>
                {!collapsed && (
                    <div className="flex-1 overflow-hidden">
                        <h2 className="text-sm font-semibold text-white truncate">Main Workspace</h2>
                        <p className="text-xs text-slate-500 truncate">{appUser?.email}</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                            isActive
                                ? "bg-emerald-600/10 text-emerald-500 font-medium shadow-sm"
                                : "hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 space-y-2">
                <NavLink
                    to="/settings"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                        isActive
                            ? "bg-slate-800 text-white"
                            : "hover:bg-slate-800 hover:text-white"
                    )}
                >
                    <Settings className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
                    {!collapsed && <span>Ajustes</span>}
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all group"
                >
                    <LogOut className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
                    {!collapsed && <span>Cerrar sesión</span>}
                </button>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-all"
                >
                    {collapsed ? <ChevronRight className="h-5 w-5 mx-auto" /> : <ChevronLeft className="h-5 w-5 mx-auto" />}
                    {!collapsed && <span className="text-xs text-slate-500">Contraer</span>}
                </button>
            </div>
        </aside>
    );
}
