import { useEffect, useState } from 'react';
import { Building2, Edit2, Landmark, Mail, Phone, Plus, Share2, User } from 'lucide-react';
import { toast } from 'sonner';
import type { Client } from '@/types';
import { useWorkspaceMutation } from '@/hooks/useFirestore';
import { Button } from '@/components/ui/button';
import { ChoiceTile } from '@/components/ui/choice-tile';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogActions, DialogHero, DialogShell } from '@/components/ui/dialog-shell';
import { FieldGroup, IconField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { CLIENT_SOURCE_OPTIONS, CLIENT_STAGE_OPTIONS } from './clientConstants';

interface ClientDialogProps {
    trigger?: React.ReactNode;
    client?: Client;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

type ClientSourceId = (typeof CLIENT_SOURCE_OPTIONS)[number]['id'];
type ClientStageId = (typeof CLIENT_STAGE_OPTIONS)[number]['id'];

export default function ClientDialog({
    trigger,
    client,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
}: ClientDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;
    const [loading, setLoading] = useState(false);
    const { createMutation, updateMutation } = useWorkspaceMutation('clients');

    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        budget: '',
        source: 'otro' as ClientSourceId,
        stage: 'nuevo' as ClientStageId,
    });

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name || '',
                company: client.company || '',
                email: client.contact?.email || '',
                phone: client.contact?.phone || '',
                budget: client.budget?.toString() || '',
                source: client.source || 'otro',
                stage: client.stage || 'nuevo',
            });
            return;
        }

        setFormData({
            name: '',
            company: '',
            email: '',
            phone: '',
            budget: '',
            source: 'otro',
            stage: 'nuevo',
        });
    }, [client, open]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formData.name) return;

        setLoading(true);
        try {
            const data = {
                name: formData.name,
                company: formData.company || null,
                stage: formData.stage,
                source: formData.source,
                budget: formData.budget ? parseFloat(formData.budget) : null,
                contact: {
                    email: formData.email || null,
                    phone: formData.phone || null,
                },
                tagIds: client?.tagIds || [],
            };

            if (client) {
                await updateMutation.mutateAsync({
                    id: client.id,
                    data,
                });
                toast.success('Cliente actualizado correctamente');
            } else {
                await createMutation.mutateAsync(data);
                toast.success('Cliente creado correctamente');
            }

            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error(client ? 'Error al actualizar el cliente' : 'Error al crear el cliente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
            {!trigger && !controlledOpen ? (
                <DialogTrigger asChild>
                    <Button variant="pagePrimary" className="h-11 gap-3 px-6">
                        <Plus className="h-5 w-5" />
                        Anadir Cliente
                    </Button>
                </DialogTrigger>
            ) : null}

            <DialogShell size="lg">
                <DialogHero
                    icon={client ? <Edit2 className="h-7 w-7" /> : <User className="h-7 w-7" />}
                    title={client ? 'Editar Perfil' : 'Nuevo Lead'}
                    description={
                        client
                            ? 'Actualiza la informacion del cliente.'
                            : 'Captura la informacion estrategica para cerrar la venta.'
                    }
                    tone="emerald"
                />

                <form onSubmit={handleSubmit} className="mt-6 space-y-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FieldGroup label="Nombre Completo">
                                <IconField icon={<User className="h-5 w-5" />}>
                                    <Input
                                        required
                                        placeholder="Ej. Juan Perez"
                                        className="pl-12"
                                        value={formData.name}
                                        onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                                    />
                                </IconField>
                            </FieldGroup>

                            <FieldGroup label="Empresa (Opcional)">
                                <IconField icon={<Building2 className="h-5 w-5" />}>
                                    <Input
                                        placeholder="Nombre de la empresa"
                                        className="pl-12"
                                        value={formData.company}
                                        onChange={(event) => setFormData({ ...formData, company: event.target.value })}
                                    />
                                </IconField>
                            </FieldGroup>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FieldGroup label="Email">
                                <IconField icon={<Mail className="h-5 w-5" />}>
                                    <Input
                                        type="email"
                                        placeholder="juan@empresa.com"
                                        className="pl-12"
                                        value={formData.email}
                                        onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                                    />
                                </IconField>
                            </FieldGroup>

                            <FieldGroup label="WhatsApp / Telefono">
                                <IconField icon={<Phone className="h-5 w-5" />}>
                                    <Input
                                        placeholder="+52 000..."
                                        className="pl-12"
                                        value={formData.phone}
                                        onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                                    />
                                </IconField>
                            </FieldGroup>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FieldGroup label="Presupuesto Estimado">
                                <IconField icon={<Landmark className="h-5 w-5" />}>
                                    <Input
                                        type="number"
                                        placeholder="Ej. 5000"
                                        className="pl-12"
                                        value={formData.budget}
                                        onChange={(event) => setFormData({ ...formData, budget: event.target.value })}
                                    />
                                </IconField>
                            </FieldGroup>

                            <FieldGroup label="Origen del Lead">
                                <IconField icon={<Share2 className="h-5 w-5" />}>
                                    <select
                                        className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
                                        value={formData.source}
                                        onChange={(event) => setFormData({ ...formData, source: event.target.value as ClientSourceId })}
                                    >
                                        {CLIENT_SOURCE_OPTIONS.map((source) => (
                                            <option key={source.id} value={source.id}>
                                                {source.label}
                                            </option>
                                        ))}
                                    </select>
                                </IconField>
                            </FieldGroup>
                        </div>

                        <FieldGroup label="Etapa actual" className="border-t border-slate-50 pt-4">
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                                {CLIENT_STAGE_OPTIONS.map((stage) => (
                                    <ChoiceTile
                                        key={stage.id}
                                        label={stage.label}
                                        tone="slate"
                                        selected={formData.stage === stage.id}
                                        onClick={() => setFormData({ ...formData, stage: stage.id })}
                                        className="h-10 rounded-xl border text-[9px] tracking-tighter"
                                    />
                                ))}
                            </div>
                        </FieldGroup>
                    </div>

                    <DialogActions
                        onCancel={() => setOpen(false)}
                        confirmLabel={client ? 'Guardar Cambios' : 'Crear Lead'}
                        disabled={!formData.name}
                        isLoading={loading}
                    />
                </form>
            </DialogShell>
        </Dialog>
    );
}
