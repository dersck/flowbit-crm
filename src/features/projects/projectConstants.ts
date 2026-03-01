import type { Project } from '@/types';

export const PROJECT_STATUS_ORDER: Project['status'][] = ['active', 'on_hold', 'done'];

export const PROJECT_STATUS_CONFIG: Record<
    Project['status'],
    {
        label: string
        textClassName: string
        bgClassName: string
        chipTone: 'emerald' | 'amber' | 'indigo'
    }
> = {
    active: {
        label: 'En Curso',
        textClassName: 'text-emerald-600',
        bgClassName: 'bg-emerald-500',
        chipTone: 'emerald',
    },
    on_hold: {
        label: 'En Pausa',
        textClassName: 'text-amber-600',
        bgClassName: 'bg-amber-500',
        chipTone: 'amber',
    },
    done: {
        label: 'Completado',
        textClassName: 'text-indigo-600',
        bgClassName: 'bg-indigo-500',
        chipTone: 'indigo',
    },
};
