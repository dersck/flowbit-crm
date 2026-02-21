import { useState } from 'react';
import { useWorkspaceQuery, useWorkspaceMutation } from '@/hooks/useFirestore';
import type { Client } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Search,
    Filter,
    ExternalLink,
    Phone,
    Mail,
    Users,
    Trash2,
    MoreVertical,
    Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import CreateClientDialog from './CreateClientDialog';

export default function ClientsPage() {
    const { data: clients, isLoading } = useWorkspaceQuery<Client>('clients', 'all-clients');
    const { deleteMutation } = useWorkspaceMutation('clients');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = clients?.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar cliente? Se perderá toda su información.')) return;
        try {
            await deleteMutation.mutateAsync(id);
            toast.success('Cliente eliminado');
        } catch (e) {
            toast.error('Error al eliminar');
        }
    };

    if (isLoading) {
        return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse border border-slate-100" />)}
        </div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Clientes</h1>
                    <p className="text-slate-500 font-medium mt-1">Directorio unificado de tu workspace.</p>
                </div>
                <CreateClientDialog />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Buscar por nombre o empresa..."
                        className="pl-12 h-12 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-12 px-6 border-slate-200 rounded-2xl gap-3 font-bold text-slate-600 bg-white">
                    <Filter className="h-5 w-5" />
                    Filtrar por Etapa
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredClients?.map((client) => (
                    <Card key={client.id} className="group hover:shadow-2xl hover:shadow-slate-200/60 hover:border-emerald-500/20 transition-all duration-500 overflow-hidden border-slate-200 bg-white rounded-[2rem]">
                        <CardContent className="p-0">
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-3xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all duration-500 transform group-hover:rotate-6 border border-slate-100 shadow-sm">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase",
                                        client.stage === 'activo' ? "bg-emerald-100 text-emerald-700" :
                                            client.stage === 'prospecto' ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
                                    )}>
                                        {client.stage}
                                    </div>
                                </div>

                                <Link to={`/clients/${client.id}`} className="block">
                                    <h3 className="text-2xl font-black text-slate-900 hover:text-emerald-600 transition-colors tracking-tighter">
                                        {client.name}
                                    </h3>
                                </Link>

                                <div className="mt-6 space-y-4">
                                    {client.contact.email && (
                                        <div className="flex items-center gap-4 text-sm font-bold text-slate-500 group/item">
                                            <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-emerald-50 group-hover/item:text-emerald-600 transition-all border border-slate-100">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            {client.contact.email}
                                        </div>
                                    )}
                                    {client.contact.phone && (
                                        <div className="flex items-center gap-4 text-sm font-bold text-slate-500 group/item">
                                            <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-indigo-50 group-hover/item:text-indigo-600 transition-all border border-slate-100">
                                                <Phone className="h-4 w-4" />
                                            </div>
                                            {client.contact.phone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-slate-50/50 px-8 py-5 border-t border-slate-100 flex items-center justify-between group-hover:bg-white transition-colors duration-300">
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl"
                                        onClick={() => handleDelete(client.id)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-xl">
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>
                                </div>
                                <Link
                                    to={`/clients/${client.id}`}
                                    className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:shadow-lg transition-all"
                                >
                                    <ExternalLink className="h-5 w-5" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredClients?.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="h-12 w-12 text-slate-200" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-300 uppercase tracking-tighter">Sin Clientes</h3>
                        <p className="text-slate-400 font-medium mt-2 max-w-sm mx-auto">Tu directorio está vacío. Comienza a registrar prospectos para hacer crecer tu negocio.</p>
                        <CreateClientDialog
                            trigger={
                                <Button className="mt-10 h-14 px-10 rounded-2xl text-lg font-black bg-emerald-600 shadow-2xl shadow-emerald-100">
                                    <Plus className="h-6 w-6 mr-3" />
                                    Nuevo Cliente
                                </Button>
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
