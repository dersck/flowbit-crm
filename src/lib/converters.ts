import {
    type FirestoreDataConverter,
    type QueryDocumentSnapshot,
    type SnapshotOptions,
    serverTimestamp
} from 'firebase/firestore';
import type { Client, Project, Task, Activity, User, Workspace, WorkspaceMember } from '@/types';

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
            createdAt: (data.createdAt as any)?.toDate(),
            updatedAt: (data.updatedAt as any)?.toDate(),
            completedAt: (data.completedAt as any)?.toDate?.(),
            startDate: (data.startDate as any)?.toDate?.(),
            dueDate: (data.dueDate as any)?.toDate?.(),
            date: (data.date as any)?.toDate?.(),
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
