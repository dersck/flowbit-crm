export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface User {
    id: string;
    email: string;
    displayName: string;
    defaultWorkspaceId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Workspace {
    id: string;
    name: string;
    logoUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface WorkspaceMember {
    id: string;
    workspaceId: string;
    userId: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface Client {
    id: string;
    workspaceId: string;
    name: string;
    company?: string;
    stage: 'nuevo' | 'contactado' | 'negociacion' | 'ganado' | 'perdido';
    source?: 'facebook' | 'instagram' | 'google' | 'referencia' | 'frio' | 'otro';
    budget?: number;
    contact: {
        phone?: string;
        email?: string;
        whatsapp?: string;
        noWhatsApp?: boolean;
    };
    tagIds: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Project {
    id: string;
    workspaceId: string;
    clientId: string;
    name: string;
    description?: string;
    status: 'active' | 'on_hold' | 'done';
    startDate?: Date;
    dueDate?: Date;
    tagIds: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Task {
    id: string;
    workspaceId: string;
    clientId?: string;
    projectId?: string;
    title: string;
    description?: string;
    status: 'inbox' | 'todo' | 'doing' | 'done' | 'archived';
    priority: 1 | 2 | 3;
    scheduledDate?: string; // YYYY-MM-DD
    dueDate?: string; // YYYY-MM-DD
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Activity {
    id: string;
    workspaceId: string;
    clientId?: string;
    projectId?: string;
    type: 'whatsapp' | 'call' | 'email' | 'note' | 'meeting';
    summary: string;
    date: Date;
    createdAt: Date;
}
