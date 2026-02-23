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
import { Textarea } from '@/components/ui/textarea';
import {
    Briefcase,
    Loader2,
    Plus,
    Calendar,
    Tag
} from 'lucide-react';
import { toast } from 'sonner';

interface CreateProjectDialogProps {
    clientId: string;
    trigger?: React.ReactNode;
}

export default function CreateProjectDialog({ clientId, trigger }: CreateProjectDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { createMutation } = useWorkspaceMutation('projects');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        dueDate: '',
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.name) return;

        setLoading(true);
        try {
            await createMutation.mutateAsync({
                clientId,
                name: formData.name,
                description: formData.description,
                status: 'active',
                dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
                startDate: new Date(),
                tagIds: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            toast.success('Proyecto creado correctamente');
            setOpen(false);
            setFormData({ name: '', description: '', dueDate: '' });
        } catch (error) {
            console.error(error);
            toast.error('Error al crear el proyecto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-emerald-600 transition-colors">
                        <Plus className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-none rounded-[2.5rem] p-10 bg-white">
                <DialogHeader className="space-y-4">
                    <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <Briefcase className="h-7 w-7" />
                    </div>
                    <div>
                        <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">Nuevo Proyecto</DialogTitle>
                        <DialogDescription className="text-slate-500 font-bold text-base mt-1">
                            Define el nuevo desafío para este cliente.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre del Proyecto</label>
                            <div className="relative">
                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    required
                                    placeholder="Ej. Rediseño Web Corporativo"
                                    className="h-12 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500/20"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fecha Límite (Opcional)</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    type="date"
                                    className="h-12 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500/20"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Descripción corta</label>
                            <Textarea
                                placeholder="¿De qué trata este proyecto?"
                                className="min-h-[100px] rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500/20 font-medium p-4 resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-8 border-t border-slate-50">
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
                            className="h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black px-10 shadow-xl shadow-indigo-100 disabled:opacity-50 transition-all active:scale-95"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : 'Crear Proyecto'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
