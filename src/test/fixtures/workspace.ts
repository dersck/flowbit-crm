import type { Activity, Client, Project, Task, User } from '@/types'

const now = new Date('2026-03-02T10:00:00.000Z')

const baseUser: User = {
  id: 'user-1',
  email: 'ada@flowbit.test',
  displayName: 'Ada Lovelace',
  defaultWorkspaceId: 'workspace-1',
  createdAt: now,
  updatedAt: now,
}

const baseClients: Client[] = [
  {
    id: 'client-1',
    workspaceId: 'workspace-1',
    name: 'Acme Studio',
    company: 'Acme Studio',
    stage: 'nuevo',
    source: 'instagram',
    budget: 12000,
    contact: {
      email: 'hola@acme.test',
      phone: '+52 555 010 0101',
    },
    tagIds: [],
    createdAt: new Date('2026-02-28T12:00:00.000Z'),
    updatedAt: new Date('2026-03-01T15:00:00.000Z'),
  },
  {
    id: 'client-2',
    workspaceId: 'workspace-1',
    name: 'Beta Logistics',
    company: 'Beta Logistics',
    stage: 'contactado',
    source: 'google',
    budget: 28000,
    contact: {
      email: 'ops@beta.test',
      phone: '+52 555 010 0102',
    },
    tagIds: [],
    createdAt: new Date('2026-02-24T09:00:00.000Z'),
    updatedAt: new Date('2026-03-02T08:00:00.000Z'),
  },
  {
    id: 'client-3',
    workspaceId: 'workspace-1',
    name: 'Casa Norte',
    company: 'Casa Norte',
    stage: 'negociacion',
    source: 'referencia',
    budget: 6400,
    contact: {
      email: 'direccion@casanorte.test',
      phone: '+52 555 010 0103',
      noWhatsApp: true,
    },
    tagIds: [],
    createdAt: new Date('2026-02-20T10:00:00.000Z'),
    updatedAt: new Date('2026-03-01T19:00:00.000Z'),
  },
]

const baseProjects: Project[] = [
  {
    id: 'project-1',
    workspaceId: 'workspace-1',
    clientId: 'client-1',
    name: 'Rediseño Web',
    description: 'Nueva presencia digital para captar leads.',
    status: 'active',
    startDate: new Date('2026-02-26T10:00:00.000Z'),
    dueDate: new Date('2026-03-15T10:00:00.000Z'),
    tagIds: [],
    createdAt: new Date('2026-02-26T10:00:00.000Z'),
    updatedAt: new Date('2026-03-01T12:00:00.000Z'),
  },
  {
    id: 'project-2',
    workspaceId: 'workspace-1',
    clientId: 'client-2',
    name: 'Automatización Comercial',
    description: 'Pipeline y seguimiento interno.',
    status: 'on_hold',
    startDate: new Date('2026-02-18T10:00:00.000Z'),
    dueDate: new Date('2026-03-20T10:00:00.000Z'),
    tagIds: [],
    createdAt: new Date('2026-02-18T10:00:00.000Z'),
    updatedAt: new Date('2026-02-27T14:00:00.000Z'),
  },
  {
    id: 'project-3',
    workspaceId: 'workspace-1',
    clientId: 'client-3',
    name: 'Landing de Ventas',
    description: 'Iteración final de campaña.',
    status: 'done',
    startDate: new Date('2026-02-10T10:00:00.000Z'),
    dueDate: new Date('2026-02-28T10:00:00.000Z'),
    tagIds: [],
    createdAt: new Date('2026-02-10T10:00:00.000Z'),
    updatedAt: new Date('2026-03-01T09:00:00.000Z'),
  },
]

const baseTasks: Task[] = [
  {
    id: 'task-1',
    workspaceId: 'workspace-1',
    clientId: 'client-1',
    projectId: 'project-1',
    title: 'Enviar propuesta comercial',
    status: 'todo',
    priority: 3,
    scheduledDate: '2026-03-02',
    createdAt: new Date('2026-03-01T10:00:00.000Z'),
    updatedAt: new Date('2026-03-01T10:00:00.000Z'),
  },
  {
    id: 'task-2',
    workspaceId: 'workspace-1',
    clientId: 'client-2',
    projectId: 'project-2',
    title: 'Revisar backlog del pipeline',
    status: 'done',
    priority: 2,
    scheduledDate: '2026-03-01',
    completedAt: new Date('2026-03-02T08:30:00.000Z'),
    createdAt: new Date('2026-02-28T10:00:00.000Z'),
    updatedAt: new Date('2026-03-02T08:30:00.000Z'),
  },
  {
    id: 'task-3',
    workspaceId: 'workspace-1',
    clientId: 'client-3',
    title: 'Confirmar llamada de cierre',
    status: 'todo',
    priority: 2,
    scheduledDate: '2026-03-01',
    createdAt: new Date('2026-02-27T12:00:00.000Z'),
    updatedAt: new Date('2026-03-01T12:00:00.000Z'),
  },
]

const baseActivities: Activity[] = [
  {
    id: 'activity-1',
    workspaceId: 'workspace-1',
    clientId: 'client-1',
    type: 'email',
    summary: 'Se envio propuesta de alcance.',
    date: new Date('2026-03-02T09:00:00.000Z'),
    createdAt: new Date('2026-03-02T09:00:00.000Z'),
  },
  {
    id: 'activity-2',
    workspaceId: 'workspace-1',
    clientId: 'client-2',
    type: 'call',
    summary: 'Seguimiento comercial y dudas de presupuesto.',
    date: new Date('2026-03-01T16:00:00.000Z'),
    createdAt: new Date('2026-03-01T16:00:00.000Z'),
  },
  {
    id: 'activity-3',
    workspaceId: 'workspace-1',
    clientId: 'client-3',
    type: 'meeting',
    summary: 'Revision final de entregables.',
    date: new Date('2026-02-27T18:00:00.000Z'),
    createdAt: new Date('2026-02-27T18:00:00.000Z'),
  },
]

function cloneClient(client: Client): Client {
  return {
    ...client,
    contact: { ...client.contact },
    tagIds: [...client.tagIds],
    createdAt: new Date(client.createdAt),
    updatedAt: new Date(client.updatedAt),
  }
}

function cloneProject(project: Project): Project {
  return {
    ...project,
    tagIds: [...project.tagIds],
    startDate: project.startDate ? new Date(project.startDate) : undefined,
    dueDate: project.dueDate ? new Date(project.dueDate) : undefined,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  }
}

function cloneTask(task: Task): Task {
  return {
    ...task,
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
  }
}

function cloneActivity(activity: Activity): Activity {
  return {
    ...activity,
    date: new Date(activity.date),
    createdAt: new Date(activity.createdAt),
  }
}

export function createTestUser(): User {
  return {
    ...baseUser,
    createdAt: new Date(baseUser.createdAt),
    updatedAt: new Date(baseUser.updatedAt),
  }
}

export function createTestClients(): Client[] {
  return baseClients.map(cloneClient)
}

export function createTestProjects(): Project[] {
  return baseProjects.map(cloneProject)
}

export function createTestTasks(): Task[] {
  return baseTasks.map(cloneTask)
}

export function createTestActivities(): Activity[] {
  return baseActivities.map(cloneActivity)
}
