import { Bell, Plus, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/AuthContext';

interface TopbarProps {
    onQuickAdd: () => void
}

export default function Topbar({ onQuickAdd }: TopbarProps) {
    const { appUser } = useAuth();

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white/90 px-6 backdrop-blur-xl">
            <div className="max-w-xl flex-1">
                <div className="group relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                    <Input
                        placeholder="Buscar clientes, proyectos, tareas..."
                        className="h-10 w-full rounded-full border-slate-200 bg-slate-50 pl-11 shadow-sm transition-all focus:border-emerald-500/30 focus:bg-white"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    onClick={onQuickAdd}
                    size="sm"
                    variant="confirm"
                    className="flex h-10 gap-2 rounded-full px-5 shadow-md shadow-emerald-100"
                >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Nuevo</span>
                </Button>
                <div className="mx-2 h-10 w-px bg-slate-200" />
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full border border-transparent text-slate-500 hover:border-slate-200 hover:text-slate-900"
                >
                    <Bell className="h-5 w-5" />
                </Button>
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 font-medium text-slate-600">
                    {appUser?.displayName?.charAt(0) || <User className="h-5 w-5" />}
                </div>
            </div>
        </header>
    );
}
