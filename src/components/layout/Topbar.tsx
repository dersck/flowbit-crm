import { Search, Plus, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/AuthContext';

interface TopbarProps {
    onQuickAdd: () => void;
}

export default function Topbar({ onQuickAdd }: TopbarProps) {
    const { appUser } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <Input
                        placeholder="Buscar clientes, proyectos, tareas..."
                        className="pl-10 bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500/30 transition-all rounded-full h-10 w-full"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    onClick={onQuickAdd}
                    size="sm"
                    className="rounded-full px-5 h-10 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 shadow-md flex gap-2"
                >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Nuevo</span>
                </Button>
                <div className="h-10 w-px bg-slate-200 mx-2" />
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200">
                    <Bell className="h-5 w-5" />
                </Button>
                <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-600 font-medium">
                    {appUser?.displayName?.charAt(0) || <User className="h-5 w-5" />}
                </div>
            </div>
        </header>
    );
}
