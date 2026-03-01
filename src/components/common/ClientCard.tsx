import { Clock, ExternalLink, Landmark, Mail, MessageSquare, MessageSquareOff, MoreVertical, Phone, Trash2, Building2 } from "lucide-react"
import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import type { Client } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import ClientAvatar from "@/components/common/ClientAvatar"
import ContactItem from "@/components/common/ContactItem"
import StatusBadge from "@/components/common/StatusBadge"
import SourceBadge from "@/components/common/SourceBadge"
import { CLIENT_STAGE_ORDER, STAGE_CONFIG } from "@/features/clients/clientConstants"
import { WhatsAppIcon } from "@/features/clients/WhatsAppIcon"

interface ClientCardProps {
    client: Client
    onDelete: (id: string) => void
    onUpdateStage: (id: string, stage: Client["stage"]) => void
    onToggleWhatsApp: (client: Client) => void
}

export default function ClientCard({
    client,
    onDelete,
    onUpdateStage,
    onToggleWhatsApp,
}: ClientCardProps) {
    return (
        <Card className="group relative flex h-[470px] flex-col overflow-visible rounded-[2.5rem] border-none bg-white shadow-xl shadow-slate-200/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] xl:h-[480px]">
            <CardContent className="flex h-full flex-col p-0">
                <div className="flex-1 p-6 sm:p-7">
                    <div className="mb-6 flex items-start justify-between">
                        <ClientAvatar
                            name={client.name}
                            size="lg"
                            className="border-slate-100 bg-slate-50 text-slate-400 transition-all duration-500 group-hover:rotate-6 group-hover:bg-slate-900 group-hover:text-white"
                        />
                        <StatusBadge stage={client.stage} showIcon className="px-4 py-1.5" />
                    </div>

                    <div className="mb-3 flex items-center gap-3">
                        {client.source ? <SourceBadge source={client.source} /> : null}
                        <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                            <Clock className="h-3 w-3" />
                            {client.updatedAt ? formatDistanceToNow(client.updatedAt, { addSuffix: true, locale: es }) : 'Reciente'}
                        </div>
                    </div>

                    <Link to={`/clients/${client.id}`} className="block h-12 group/title">
                        <h3 className="truncate text-[clamp(1.55rem,2vw,2rem)] font-black leading-tight tracking-tighter text-slate-900 transition-colors group-hover/title:text-emerald-600">
                            {client.name}
                        </h3>
                        {client.company ? (
                            <div className="mt-1 flex items-center gap-2 truncate text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:text-sm">
                                <Building2 className="h-3 w-3" />
                                {client.company}
                            </div>
                        ) : (
                            <div className="h-6" />
                        )}
                    </Link>

                    <div className="mt-5 space-y-2.5">
                        {client.contact.email ? (
                            <ContactItem
                                icon={Mail}
                                value={client.contact.email}
                                tone="emerald"
                                className="text-sm"
                            />
                        ) : (
                            <div className="h-10" />
                        )}
                        {client.contact.phone ? (
                            <ContactItem
                                icon={Phone}
                                value={<span className="font-mono">{client.contact.phone}</span>}
                                tone="indigo"
                                href={`tel:${client.contact.phone}`}
                                className="text-sm"
                            />
                        ) : (
                            <div className="h-10" />
                        )}
                        {client.budget ? (
                            <ContactItem
                                icon={Landmark}
                                value={<span className="font-black text-amber-700">${client.budget.toLocaleString()}</span>}
                                tone="amber"
                                className="text-sm"
                            />
                        ) : (
                            <div className="h-10" />
                        )}
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-center gap-2.5 rounded-b-[2.5rem] border-t border-slate-50 bg-slate-50/50 px-7 py-5 transition-colors duration-300 group-hover:bg-white sm:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 flex-shrink-0 rounded-2xl text-slate-300 transition-all hover:bg-rose-50 hover:text-rose-500"
                        onClick={() => onDelete(client.id)}
                    >
                        <Trash2 className="h-5 w-5" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-11 w-11 rounded-2xl text-slate-300 transition-all hover:bg-slate-100 hover:text-slate-900"
                            >
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-64">
                            <DropdownMenuLabel className="p-3 pb-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Mover a etapa
                            </DropdownMenuLabel>
                            {CLIENT_STAGE_ORDER.map((stage) => {
                                const stageConfig = STAGE_CONFIG[stage]
                                const StageOptionIcon = stageConfig.icon

                                return (
                                    <DropdownMenuItem
                                        key={stage}
                                        onClick={() => onUpdateStage(client.id, stage)}
                                        className={cn(
                                            "gap-3",
                                            client.stage === stage ? "bg-slate-50/50 text-slate-900" : "text-slate-500"
                                        )}
                                    >
                                        <StageOptionIcon className={cn("h-4 w-4", client.stage === stage ? "text-slate-900" : "text-slate-400")} />
                                        {stageConfig.label}
                                    </DropdownMenuItem>
                                )
                            })}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className={cn(
                                    "gap-3",
                                    client.contact.noWhatsApp ? "text-emerald-600 hover:bg-emerald-50" : "text-amber-600 hover:bg-amber-50"
                                )}
                                onClick={() => onToggleWhatsApp(client)}
                            >
                                {client.contact.noWhatsApp ? (
                                    <MessageSquare className="h-4 w-4" />
                                ) : (
                                    <MessageSquareOff className="h-4 w-4" />
                                )}
                                {client.contact.noWhatsApp ? 'Tiene WhatsApp' : 'No tiene WhatsApp'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {client.contact.phone ? (
                        client.contact.noWhatsApp ? (
                            <Button
                                variant="outline"
                                size="icon"
                                disabled
                                className="h-11 w-11 flex-shrink-0 rounded-2xl border-none bg-slate-50 text-slate-300 opacity-40"
                                title="Este numero no tiene WhatsApp"
                            >
                                <MessageSquareOff className="h-5 w-5" />
                            </Button>
                        ) : (
                            <Button
                                asChild
                                size="icon"
                                className="h-11 w-11 flex-shrink-0 rounded-2xl border-none bg-emerald-500 text-white shadow-lg shadow-emerald-200/50 transition-all active:scale-95 hover:bg-emerald-600"
                            >
                                <a
                                    href={`https://wa.me/${client.contact.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <WhatsAppIcon className="h-5 w-5" />
                                </a>
                            </Button>
                        )
                    ) : null}

                    <Button
                        asChild
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 flex-shrink-0 rounded-2xl border-slate-200 text-slate-400 transition-all active:scale-95 hover:border-emerald-100 hover:text-emerald-600 hover:shadow-xl"
                    >
                        <Link to={`/clients/${client.id}`}>
                            <ExternalLink className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
