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
import { Plus, User, Mail, Phone, Loader2, Building2, Landmark, Share2 } from 'lucide-react';
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

const SOURCES = [
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'google', label: 'Google' },
    { id: 'referencia', label: 'Referencia' },
    { id: 'frio', label: 'Frío' },
    { id: 'otro', label: 'Otro' },
] as const;

export default function CreateClientDialog({ trigger }: CreateClientDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { createMutation } = useWorkspaceMutation('clients');

    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        budget: '',
        source: 'otro' as typeof SOURCES[number]['id'],
        stage: 'nuevo' as typeof STAGES[number]['id'],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;

        setLoading(true);
        try {
            await createMutation.mutateAsync({
                name: formData.name,
                company: formData.company || null,
                stage: formData.stage,
                source: formData.source,
                budget: formData.budget ? parseFloat(formData.budget) : null,
                contact: {
                    email: formData.email || null,
                    phone: formData.phone || null,
                },
                tagIds: [],
            });
            toast.success('Cliente creado correctamente');
            setOpen(false);
            setFormData({
                name: '',
                company: '',
                email: '',
                phone: '',
                budget: '',
                source: 'otro',
                stage: 'nuevo'
            });
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
            <DialogContent className="sm:max-w-[600px] border-none rounded-[2.5rem] p-10 bg-white max-h-[90vh] overflow-y-auto scrollbar-hide">
                <DialogHeader className="space-y-4">
                    <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                        <User className="h-7 w-7" />
                    </div>
                    <div>
                        <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">Nuevo Lead</DialogTitle>
                        <DialogDescription className="text-slate-500 font-bold text-base mt-1">
                            Captura la información estratégica para cerrar la venta.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                    <div className="space-y-6">
                        {/* Basic Info Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Empresa (Opcional)</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        placeholder="Nombre de la empresa"
                                        className="h-12 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500/20"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">WhatsApp / Teléfono</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        placeholder="+52 000..."
                                        className="h-12 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-indigo-500/20"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Business Data Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Presupuesto Estimado</label>
                                <div className="relative">
                                    <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        type="number"
                                        placeholder="Ej. 5000"
                                        className="h-12 pl-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-amber-500/20"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Origen del Lead</label>
                                <div className="relative">
                                    <Share2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                                    <select
                                        className="w-full h-12 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-emerald-500/20 text-sm font-bold text-slate-600 outline-none appearance-none transition-all"
                                        value={formData.source}
                                        onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                                    >
                                        {SOURCES.map(source => (
                                            <option key={source.id} value={source.id}>{source.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Stage Selector */}
                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Etapa Inicial en el Embudo</label>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                {STAGES.map((stage) => (
                                    <button
                                        key={stage.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, stage: stage.id })}
                                        className={cn(
                                            "h-10 rounded-xl text-[9px] font-black uppercase tracking-tighter border transition-all",
                                            formData.stage === stage.id
                                                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                                                : "bg-white text-slate-400 border-slate-200 hover:border-slate-400"
                                        )}
                                    >
                                        {stage.label}
                                    </button>
                                ))}
                            </div>
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
                            className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black px-10 shadow-xl shadow-emerald-100 disabled:opacity-50 transition-all active:scale-95"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : 'Crear Lead Estratégico'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
