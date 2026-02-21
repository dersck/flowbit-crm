import { useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    User,
    Settings,
    Cloud,
    Database,
    Download,
    Upload,
    Shield,
    Bell,
    CreditCard,
    ChevronRight,
    Map
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { appUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'workspace' | 'backups' | 'notifications'>('profile');

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Configuración</h1>
                <p className="text-slate-500 font-medium mt-1">Gestiona tu perfil, workspace y seguridad de datos.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Navigation Sidebar */}
                <aside className="w-full lg:w-64 space-y-2">
                    <NavButton
                        icon={User}
                        label="Mi Perfil"
                        active={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                    />
                    <NavButton
                        icon={Settings}
                        label="Workspace"
                        active={activeTab === 'workspace'}
                        onClick={() => setActiveTab('workspace')}
                    />
                    <NavButton
                        icon={Database}
                        label="Respaldos"
                        active={activeTab === 'backups'}
                        onClick={() => setActiveTab('backups')}
                    />
                    <NavButton
                        icon={Bell}
                        label="Notificaciones"
                        active={activeTab === 'notifications'}
                        onClick={() => setActiveTab('notifications')}
                    />
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 space-y-8">
                    {activeTab === 'profile' && (
                        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
                            <CardHeader className="p-10 border-b border-slate-50">
                                <CardTitle className="text-2xl font-black">Información Personal</CardTitle>
                                <CardDescription className="text-slate-400 font-bold">Actualiza tu información pública y de contacto.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                <div className="flex items-center gap-8">
                                    <div className="h-24 w-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl">
                                        {appUser?.displayName?.charAt(0) || '?'}
                                    </div>
                                    <Button variant="outline" className="rounded-xl border-slate-200 font-bold px-6">Cambiar Foto</Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre Completo</label>
                                        <Input defaultValue={appUser?.displayName} className="h-12 rounded-2xl border-slate-200 px-5 focus:ring-slate-900/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
                                        <Input disabled defaultValue={appUser?.email} className="h-12 rounded-2xl border-slate-200 px-5 bg-slate-50" />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex justify-end">
                                    <Button className="h-12 rounded-2xl bg-slate-900 text-white font-black px-10 shadow-lg" onClick={() => toast.success('Perfil actualizado')}>
                                        Guardar Cambios
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'backups' && (
                        <div className="space-y-8">
                            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
                                <CardHeader className="p-10 border-b border-slate-50">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-100">
                                            <Cloud className="h-6 w-6 text-white" />
                                        </div>
                                        <CardTitle className="text-2xl font-black">Nube y Seguridad</CardTitle>
                                    </div>
                                    <CardDescription className="text-slate-400 font-bold">Configura tus respaldos automáticos en Google Drive.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-10 space-y-8">
                                    <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-6">
                                            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                                <Map className="h-6 w-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">Google Drive Disconnect</p>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Estado: Desconectado</p>
                                            </div>
                                        </div>
                                        <Button className="rounded-xl bg-slate-900 text-white font-bold h-11 px-6">Conectar</Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-8 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-emerald-500/30 transition-colors group">
                                            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                <Download className="h-6 w-6 text-emerald-600" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Exportar Todo</h3>
                                            <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">Descarga un archivo JSON con toda la información de tu CRM (Contactos, Proyectos, Tareas).</p>
                                            <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 font-bold hover:bg-emerald-50 transform active:scale-95 transition-all">Generar Backup</Button>
                                        </div>

                                        <div className="p-8 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-amber-500/30 transition-colors group">
                                            <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                <Upload className="h-6 w-6 text-amber-600" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Restaurar Info</h3>
                                            <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6">Importa un archivo de respaldo previo para recuperar tu información. Sobrescribirá los datos actuales.</p>
                                            <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 font-bold hover:bg-amber-50 transform active:scale-95 transition-all text-amber-600 border-amber-100">Cargar Archivo</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl shadow-slate-400">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                        <Shield className="h-7 w-7 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-black uppercase tracking-tight">Seguridad de Datos</p>
                                        <p className="text-indigo-300 text-sm font-bold opacity-80">Toda tu información está cifrada y almacenada en infraestructuras nivel bancario.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'workspace' && (
                        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
                            <CardHeader className="p-10 border-b border-slate-50">
                                <CardTitle className="text-2xl font-black">Workspace</CardTitle>
                                <CardDescription className="text-slate-400 font-bold">Personaliza tu espacio de trabajo colaborativo.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-10 space-y-6">
                                <p className="text-slate-400 font-bold italic text-center py-20">Próximamente: Gestión de miembros, roles y planes.</p>
                                <div className="flex justify-center">
                                    <Button className="h-14 px-10 rounded-2xl bg-indigo-600 flex gap-3 font-black shadow-xl shadow-indigo-100">
                                        <CreditCard className="h-5 w-5" />
                                        Ver Planes Pro
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </main>
            </div>
        </div>
    );
}

function NavButton({ icon: Icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group",
                active
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-2"
                    : "text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-100"
            )}
        >
            <div className="flex items-center gap-4">
                <Icon className={cn("h-5 w-5", active ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                <span className="font-bold tracking-tight">{label}</span>
            </div>
            {active && <ChevronRight className="h-4 w-4" />}
        </button>
    );
}
