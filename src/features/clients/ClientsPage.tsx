import { useState } from 'react';
import { useWorkspaceQuery } from '@/hooks/useFirestore';
import type { Client } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Search,
    Plus,
    Filter,
    ExternalLink,
    Phone,
    Mail,
    Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function ClientsPage() {
    const { data: clients, isLoading } = useWorkspaceQuery<Client>('clients', 'all-clients');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = clients?.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div className="animate-pulse space-y-4">
            <div className="h-10 bg-slate-200 rounded-lg w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl" />)}
            </div>
        </div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Clientes</h1>
                    <p className="text-slate-500">Gestiona tus prospectos y clientes activos</p>
                </div>
                <Button className="flex gap-2 h-11 px-6 rounded-xl shadow-lg shadow-emerald-100 font-semibold transition-all hover:scale-[1.02]">
                    <Plus className="h-5 w-5" />
                    Nuevo Cliente
                </Button>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Buscar por nombre..."
                        className="pl-10 h-10 bg-white border-slate-200 rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-10 border-slate-200 gap-2 rounded-lg">
                    <Filter className="h-4 w-4" />
                    Filtros
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients?.map((client) => (
                    <Card key={client.id} className="group hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 overflow-hidden border-slate-200 bg-white rounded-2xl">
                        <CardContent className="p-0">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-2xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all duration-500 transform group-hover:rotate-3 border border-slate-100">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-bold tracking-wider",
                                        client.stage === 'activo' ? "bg-emerald-100 text-emerald-700" :
                                            client.stage === 'prospecto' ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
                                    )}>
                                        {client.stage.toUpperCase()}
                                    </div>
                                </div>
                                <Link to={`/clients/${client.id}`} className="block">
                                    <h3 className="text-xl font-bold text-slate-900 hover:text-emerald-600 transition-colors tracking-tight">
                                        {client.name}
                                    </h3>
                                </Link>
                                <div className="mt-4 space-y-2.5">
                                    {client.contact.email && (
                                        <div className="flex items-center gap-3 text-sm text-slate-500 group/item">
                                            <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-white group-hover/item:shadow-sm transition-all border border-transparent group-hover/item:border-slate-100 font-bold italic">@</div>
                                            {client.contact.email}
                                        </div>
                                    )}
                                    {client.contact.phone && (
                                        <div className="flex items-center gap-3 text-sm text-slate-500 group/item">
                                            <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-white group-hover/item:shadow-sm transition-all border border-transparent group-hover/item:border-slate-100">
                                                <Phone className="h-3 w-3" />
                                            </div>
                                            {client.contact.phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex items-center justify-between group-hover:bg-white transition-colors duration-300">
                                <span className="text-xs text-slate-400 font-medium">Actualizado recientemente</span>
                                <Link to={`/clients/${client.id}`} className="text-slate-400 hover:text-emerald-600 transition-colors">
                                    <ExternalLink className="h-4.5 w-4.5" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredClients?.length === 0 && (
                    <div className="col-span-full py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                        <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                            <Users className="h-12 w-12" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">No hay clientes aún</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2">Empieza agregando tu primer cliente o prospecto para ver sus detalles aquí.</p>
                        <Button className="mt-8 px-8 h-12 rounded-xl text-lg font-medium shadow-xl shadow-emerald-100">
                            <Plus className="h-5 w-5 mr-2" />
                            Crear Cliente
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
