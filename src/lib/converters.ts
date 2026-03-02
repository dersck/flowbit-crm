import {
    type FirestoreDataConverter,
    type QueryDocumentSnapshot,
    type SnapshotOptions,
    type WithFieldValue,
    serverTimestamp
} from 'firebase/firestore';
import type { Client, Project, Task, Activity, User, Workspace, WorkspaceMember } from '@/types';

type FirestoreDateValue = {
    toDate: () => Date;
} | Date | null | undefined;

const toDate = (val: FirestoreDateValue) => {
    if (!val) return null;
    if (typeof val === 'object' && 'toDate' in val && typeof val.toDate === 'function') return val.toDate();
    if (val instanceof Date) return val;
    return null;
};

const genericConverter = <T extends { id: string }>(): FirestoreDataConverter<T> => ({
    toFirestore: (data: WithFieldValue<T>) => {
        const rest = { ...(data as WithFieldValue<T> & Record<string, unknown> & { id?: string }) };
        if ('id' in rest) {
            Reflect.deleteProperty(rest, 'id');
        }
        // Filter out undefined values as Firestore doesn't support them
        const cleanData = Object.keys(rest).reduce<Record<string, unknown>>((acc, key) => {
            if (rest[key] !== undefined) {
                acc[key] = rest[key];
            }
            return acc;
        }, {});

        return {
            ...cleanData,
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
