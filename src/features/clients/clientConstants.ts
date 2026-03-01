import {
    CheckCircle2,
    Facebook,
    Globe,
    Instagram,
    type LucideIcon,
    MessageSquare,
    TrendingUp,
    UserPlus,
    Users,
    XCircle,
    Zap,
} from "lucide-react"
import type { Client } from "@/types"
import { WhatsAppIcon } from "./WhatsAppIcon"

export const CLIENT_STAGE_ORDER: Client["stage"][] = [
    "nuevo",
    "contactado",
    "negociacion",
    "ganado",
    "perdido",
]

export const CLIENT_STAGE_OPTIONS = [
    { id: "nuevo", label: "Nuevo" },
    { id: "contactado", label: "Contactado" },
    { id: "negociacion", label: "Negociacion" },
    { id: "ganado", label: "Ganado" },
    { id: "perdido", label: "Perdido" },
] as const

export const CLIENT_SOURCE_OPTIONS = [
    { id: "facebook", label: "Facebook" },
    { id: "instagram", label: "Instagram" },
    { id: "google", label: "Google" },
    { id: "referencia", label: "Referencia" },
    { id: "frio", label: "Frio" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "otro", label: "Otro" },
] as const

export const STAGE_CONFIG: Record<Client["stage"], { label: string; color: string; icon: LucideIcon }> = {
    nuevo: { label: "Nuevo Lead", color: "bg-blue-100 text-blue-700 border-blue-200", icon: UserPlus },
    contactado: { label: "Contactado", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: MessageSquare },
    negociacion: { label: "Negociacion", color: "bg-amber-100 text-amber-700 border-amber-200", icon: TrendingUp },
    ganado: { label: "Ganado", color: "bg-slate-900 text-white border-slate-900", icon: CheckCircle2 },
    perdido: { label: "Perdido", color: "bg-rose-100 text-rose-700 border-rose-200", icon: XCircle },
}

export const SOURCE_CONFIG = {
    facebook: { icon: Facebook, color: "text-blue-600", bg: "bg-blue-50" },
    instagram: { icon: Instagram, color: "text-pink-600", bg: "bg-pink-50" },
    google: { icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50" },
    referencia: { icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    frio: { icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
    whatsapp: { icon: WhatsAppIcon, color: "text-emerald-600", bg: "bg-emerald-50" },
    otro: { icon: MessageSquare, color: "text-slate-600", bg: "bg-slate-50" },
} as const

export const PIPELINE_STAGE_CONFIG: Record<Client["stage"], { color: string }> = {
    nuevo: { color: "border-blue-200 bg-blue-50/50" },
    contactado: { color: "border-emerald-200 bg-emerald-50/50" },
    negociacion: { color: "border-amber-200 bg-amber-50/50" },
    ganado: { color: "border-slate-900 bg-slate-900/5" },
    perdido: { color: "border-rose-200 bg-rose-50/50" },
}
