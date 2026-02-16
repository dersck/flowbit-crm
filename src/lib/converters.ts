import {
    type FirestoreDataConverter,
    type QueryDocumentSnapshot,
    type SnapshotOptions,
    serverTimestamp
} from 'firebase/firestore';
import type { Client, Project, Task, Activity, User, Workspace, WorkspaceMember } from '@/types';

const toDate = (val: any) => {
    if (!val) return null;
    if (typeof val.toDate === 'function') return val.toDate();
    if (val instanceof Date) return val;
    return null;
};

const genericConverter = <T extends { id: string }>(): FirestoreDataConverter<T> => ({
    toFirestore: (data: any) => {
        const { id, ...rest } = data;
        return {
            ...rest,
            updatedAt: serverTimestamp(),
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T => {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            ...data,
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt),
            completedAt: toDate(data.completedAt),
            startDate: toDate(data.startDate),
            dueDate: toDate(data.dueDate),
            date: toDate(data.date),
        } as unknown as T;
    },
});

export const converters = {
    users: genericConverter<User>(),
    workspaces: genericConverter<Workspace>(),
    workspaceMembers: genericConverter<WorkspaceMember>(),
    clients: genericConverter<Client>(),
    projects: genericConverter<Project>(),
    tasks: genericConverter<Task>(),
    activities: genericConverter<Activity>(),
};
