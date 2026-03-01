import { useState, type ComponentType } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { FieldGroup } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { Surface } from '@/components/ui/surface';
import {
    Bell,
    ChevronRight,
    Cloud,
    CreditCard,
    Database,
    Download,
    Map,
    Settings,
    Shield,
    Upload,
    User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type SettingsTab = 'profile' | 'workspace' | 'backups' | 'notifications';

const tabs: Array<{
    id: SettingsTab
    label: string
    icon: ComponentType<{ className?: string }>
}> = [
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'workspace', label: 'Workspace', icon: Settings },
    { id: 'backups', label: 'Respaldos', icon: Database },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
];

export default function SettingsPage() {
    const { appUser } = useAuth();
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

    return (
        <div className="mx-auto max-w-6xl space-y-8 pb-16">
            <PageHeader
                title="Configuracion"
                subtitle="Gestiona tu perfil, workspace y seguridad de datos."
                eyebrow="Workspace Control"
                icon={(
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-lg">
                        <Settings className="h-4 w-4" />
                    </div>
                )}
            />

            <div className="flex flex-col gap-8 lg:flex-row">
                <Surface variant="premiumBordered" className="w-full rounded-[2rem] p-3 lg:w-72 lg:self-start">
                    <div className="space-y-2">
                        {tabs.map((tab) => (
                            <SettingsNavButton
                                key={tab.id}
                                icon={tab.icon}
                                label={tab.label}
                                active={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                            />
                        ))}
                    </div>
                </Surface>

                <main className="flex-1 space-y-6">
                    {activeTab === 'profile' ? (
                        <Surface className="overflow-hidden rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
                            <div className="border-b border-slate-50 p-8">
                                <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Informacion Personal</h2>
                                <p className="mt-1 font-bold text-slate-400">
                                    Actualiza tu informacion publica y de contacto.
                                </p>
                            </div>

                            <div className="space-y-6 p-8">
                                <div className="flex items-center gap-6">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-slate-900 text-[1.65rem] font-black text-white shadow-xl">
                                        {appUser?.displayName?.charAt(0) || '?'}
                                    </div>
                                    <Button variant="outline" className="h-11 rounded-2xl px-5 font-bold">
                                        Cambiar Foto
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <FieldGroup label="Nombre Completo">
                                        <Input
                                            defaultValue={appUser?.displayName}
                                            className="h-12 px-5"
                                        />
                                    </FieldGroup>
                                    <FieldGroup label="Email">
                                        <Input
                                            disabled
                                            defaultValue={appUser?.email}
                                            className="h-12 bg-slate-50 px-5"
                                        />
                                    </FieldGroup>
                                </div>

                                <div className="flex justify-end border-t border-slate-50 pt-4">
                                    <Button
                                        variant="pagePrimary"
                                        size="lg"
                                        className="px-8"
                                        onClick={() => toast.success('Perfil actualizado')}
                                    >
                                        Guardar Cambios
                                    </Button>
                                </div>
                            </div>
                        </Surface>
                    ) : null}

                    {activeTab === 'backups' ? (
                        <div className="space-y-6">
                            <Surface className="overflow-hidden rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
                                <div className="border-b border-slate-50 p-8">
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className="rounded-2xl bg-emerald-600 p-2.5 shadow-lg shadow-emerald-100">
                                            <Cloud className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Nube y Seguridad</h2>
                                    </div>
                                    <p className="font-bold text-slate-400">
                                        Configura tus respaldos automaticos en Google Drive.
                                    </p>
                                </div>

                                <div className="space-y-6 p-8">
                                    <Surface
                                        variant="premiumBordered"
                                        className="flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow-none"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                                                <Map className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">Google Drive Disconnect</p>
                                                <p className="mt-0.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                                                    Estado: Desconectado
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="pagePrimary" className="h-11 px-5 font-bold">
                                            Conectar
                                        </Button>
                                    </Surface>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <BackupActionCard
                                            icon={Download}
                                            title="Exportar Todo"
                                            description="Descarga un archivo JSON con toda la informacion de tu CRM."
                                            tone="emerald"
                                            actionLabel="Generar Backup"
                                        />
                                        <BackupActionCard
                                            icon={Upload}
                                            title="Restaurar Info"
                                            description="Importa un respaldo previo para recuperar informacion."
                                            tone="amber"
                                            actionLabel="Cargar Archivo"
                                        />
                                    </div>
                                </div>
                            </Surface>

                            <Surface variant="dark" className="flex items-center justify-between rounded-[2.5rem] p-6 shadow-2xl shadow-slate-400">
                                <div className="flex items-center gap-5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                                        <Shield className="h-6 w-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black uppercase tracking-tight sm:text-xl">Seguridad de Datos</p>
                                        <p className="text-sm font-bold text-indigo-300 opacity-80">
                                            Tu informacion esta cifrada y almacenada en infraestructura segura.
                                        </p>
                                    </div>
                                </div>
                            </Surface>
                        </div>
                    ) : null}

                    {activeTab === 'workspace' ? (
                        <Surface className="overflow-hidden rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
                            <div className="border-b border-slate-50 p-8">
                                <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Workspace</h2>
                                <p className="mt-1 font-bold text-slate-400">
                                    Personaliza tu espacio de trabajo colaborativo.
                                </p>
                            </div>
                            <div className="space-y-6 p-8">
                                <EmptyState
                                    icon={CreditCard}
                                    title="Proximamente"
                                    description="Gestion de miembros, roles y planes en una sola vista."
                                />
                                <div className="flex justify-center">
                                    <Button variant="tool" size="lg" className="gap-3 px-8">
                                        <CreditCard className="h-5 w-5" />
                                        Ver Planes Pro
                                    </Button>
                                </div>
                            </div>
                        </Surface>
                    ) : null}

                    {activeTab === 'notifications' ? (
                        <Surface className="overflow-hidden rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
                            <div className="border-b border-slate-50 p-8">
                                <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Notificaciones</h2>
                                <p className="mt-1 font-bold text-slate-400">
                                    Controla alertas, recordatorios y avisos del workspace.
                                </p>
                            </div>
                            <div className="space-y-6 p-8">
                                <EmptyState
                                    icon={Bell}
                                    title="Centro de alertas"
                                    description="La configuracion avanzada de notificaciones estara disponible en una siguiente fase."
                                />
                                <div className="flex justify-center">
                                    <Button variant="soft" size="lg">
                                        Recordarme despues
                                    </Button>
                                </div>
                            </div>
                        </Surface>
                    ) : null}
                </main>
            </div>
        </div>
    );
}

function SettingsNavButton({
    icon: Icon,
    label,
    active,
    onClick,
}: {
    icon: ComponentType<{ className?: string }>
    label: string
    active: boolean
    onClick: () => void
}) {
    return (
        <Button
            type="button"
            variant="ghost"
            onClick={onClick}
            className={cn(
                'h-auto w-full justify-between rounded-2xl px-5 py-3.5 transition-all',
                active
                    ? 'translate-x-2 bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-slate-900 hover:text-white'
                    : 'border border-transparent text-slate-500 hover:border-slate-100 hover:bg-white hover:text-slate-900'
            )}
        >
            <div className="flex items-center gap-4">
                <Icon className={cn('h-5 w-5', active ? 'text-white' : 'text-slate-400')} />
                <span className="font-bold tracking-tight">{label}</span>
            </div>
            {active ? <ChevronRight className="h-4 w-4" /> : null}
        </Button>
    );
}

function BackupActionCard({
    icon: Icon,
    title,
    description,
    tone,
    actionLabel,
}: {
    icon: ComponentType<{ className?: string }>
    title: string
    description: string
    tone: 'emerald' | 'amber'
    actionLabel: string
}) {
    return (
        <Surface
            variant="dashed"
            className={cn(
                'group rounded-[2rem] border-slate-200 p-6 transition-colors',
                tone === 'emerald' ? 'hover:border-emerald-500/30' : 'hover:border-amber-500/30'
            )}
        >
            <div
                className={cn(
                    'mb-5 flex h-11 w-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-110',
                    tone === 'emerald' ? 'bg-emerald-50' : 'bg-amber-50'
                )}
            >
                <Icon className={cn('h-5 w-5', tone === 'emerald' ? 'text-emerald-600' : 'text-amber-600')} />
            </div>
            <h3 className="mb-2 text-lg font-black uppercase tracking-tight text-slate-900 sm:text-xl">{title}</h3>
            <p className="mb-5 text-sm font-medium leading-relaxed text-slate-400">{description}</p>
            <Button
                variant="outline"
                className={cn(
                    'h-11 w-full rounded-2xl font-bold',
                    tone === 'emerald'
                        ? 'hover:bg-emerald-50'
                        : 'border-amber-100 text-amber-600 hover:bg-amber-50 hover:text-amber-600'
                )}
            >
                {actionLabel}
            </Button>
        </Surface>
    );
}
