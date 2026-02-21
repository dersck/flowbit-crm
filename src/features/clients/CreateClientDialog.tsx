import { useState } from 'react';
import { useWorkspaceMutation } from '@/hooks/useFirestore';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, User, Mail, Phone, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CreateClientDialogProps {
    trigger?: React.ReactNode;
}

const STAGES = [
    { id: 'nuevo', label: 'Nuevo' },
    { id: 'contactado', label: 'Contactado' },
    { id: 'negociacion', label: 'Negociación' },
    { id: 'ganado', label: 'Ganado' },
    { id: 'perdido', label: 'Perdido' },
] as const;

export default function CreateClientDialog({ trigger }: CreateClientDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { createMutation } = useWorkspaceMutation('clients');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        stage: 'nuevo' as typeof STAGES[number]['id'],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;

        setLoading(true);
        try {
            await createMutation.mutateAsync({
                name: formData.name,
                stage: formData.stage,
                contact: {
                    email: formData.email,
                    phone: formData.phone,
                },
                tagIds: [],
            });
            toast.success('Cliente creado correctamente');
            setOpen(false);
            setFormData({ name: '', email: '', phone: '', stage: 'nuevo' });
        } catch (error) {
            console.error(error);
            toast.error('Error al crear el cliente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="h-12 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200 font-bold flex gap-3">
                        <Plus className="h-5 w-5" />
                        Añadir Cliente
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-none rounded-[2.5rem] p-10 bg-white">
                <DialogHeader className="space-y-4">
                    <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                        <User className="h-7 w-7" />
                    </div>
                    <div>
                        <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">Nuevo Cliente</DialogTitle>
                        <DialogDescription className="text-slate-500 font-bold text-base mt-1">
                            Ingresa los datos básicos para comenzar a gestionar este contacto.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre Completo</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    required
                                    placeholder="Ej. Juan Pérez"
                                    className="h-12 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-emerald-500/20"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        type="email"
                                        placeholder="juan@empresa.com"
                                        className="h-12 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-emerald-500/20"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Teléfono</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        placeholder="+52 000..."
                                        className="h-12 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-emerald-500/20"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Etapa Inicial</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {STAGES.map((stage) => (
                                    <button
                                        key={stage.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, stage: stage.id })}
                                        className={cn(
                                            "h-11 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                            formData.stage === stage.id
                                                ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                                : "bg-white text-slate-400 border-slate-200 hover:border-slate-400"
                                        )}
                                    >
                                        {stage.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-6 border-t border-slate-50">
                        <Button
                            type="button"
                            variant="ghost"
                            className="h-12 rounded-2xl font-bold px-8"
                            onClick={() => setOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !formData.name}
                            className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black px-10 shadow-xl shadow-emerald-100 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : 'Crear Cliente'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
