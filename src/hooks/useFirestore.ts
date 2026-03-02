import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    addDoc,
    setDoc,
    deleteDoc,
    serverTimestamp,
    type FirestoreDataConverter,
    type QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { converters } from '@/lib/converters';
import { useAuth } from '@/features/auth/AuthContext';
import { useWorkspaceFixtureContext } from '@/features/testing/workspace-fixture-provider';
import type { Activity, Client, Project, Task } from '@/types';

type WorkspaceEntity = {
    id?: string;
    workspaceId?: string;
    createdAt?: unknown;
    updatedAt?: unknown;
};

type MutationPayload = Record<string, unknown>;
type CollectionName = keyof typeof converters;
type FixtureCollectionDataMap = {
    activities: Activity[];
    clients: Client[];
    projects: Project[];
    tasks: Task[];
};

function getConverter<T extends { id?: string }>(collectionName: CollectionName) {
    return converters[collectionName] as unknown as FirestoreDataConverter<T>;
}

export function useWorkspaceQuery<T extends { id: string }>(
    collectionName: CollectionName,
    queryName: string,
    extraWheres: QueryConstraint[] = []
) {
    const { appUser } = useAuth();
    const workspaceId = appUser?.defaultWorkspaceId;
    const fixtureContext = useWorkspaceFixtureContext();
    const hasFixtureData = Boolean(
        fixtureContext &&
        collectionName in fixtureContext.queries
    );
    const fixtureData = (
        hasFixtureData
            ? fixtureContext?.queries[collectionName as keyof FixtureCollectionDataMap]
            : undefined
    ) as T[] | undefined;

    return useQuery({
        queryKey: hasFixtureData
            ? ['fixture', collectionName, queryName]
            : [collectionName, workspaceId, queryName, extraWheres],
        queryFn: async () => {
            if (hasFixtureData) return fixtureData ?? [];
            if (!workspaceId) return [];

            const q = query(
                collection(db, collectionName).withConverter(getConverter<T>(collectionName)),
                where('workspaceId', '==', workspaceId),
                ...extraWheres
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map((document) => document.data());
        },
        enabled: hasFixtureData || !!workspaceId,
    });
}

export function useEntityQuery<T extends { id: string; workspaceId?: string }>(
    collectionName: CollectionName,
    id: string | undefined
) {
    const { appUser } = useAuth();
    const workspaceId = appUser?.defaultWorkspaceId;
    const fixtureContext = useWorkspaceFixtureContext();
    const hasFixtureData = Boolean(
        fixtureContext &&
        collectionName in fixtureContext.queries
    );
    const fixtureData = (
        hasFixtureData
            ? fixtureContext?.queries[collectionName as keyof FixtureCollectionDataMap]
            : undefined
    ) as T[] | undefined;

    return useQuery({
        queryKey: hasFixtureData
            ? ['fixture-entity', collectionName, id]
            : [collectionName, workspaceId, id],
        queryFn: async () => {
            if (hasFixtureData) {
                if (!id) return null;
                return fixtureData?.find((entity) => entity.id === id) ?? null;
            }
            if (!workspaceId || !id) return null;

            const ref = doc(db, collectionName, id).withConverter(getConverter<T>(collectionName));
            const snapshot = await getDoc(ref);

            if (!snapshot.exists()) return null;

            const data = snapshot.data();
            // Verify ownership
            if (data.workspaceId !== workspaceId) return null;

            return data;
        },
        enabled: hasFixtureData ? !!id : (!!workspaceId && !!id),
    });
}

export function useWorkspaceMutation(
    collectionName: CollectionName
) {
    const queryClient = useQueryClient();
    const { appUser } = useAuth();
    const workspaceId = appUser?.defaultWorkspaceId;
    const fixtureContext = useWorkspaceFixtureContext();
    const fixtureMutations = fixtureContext?.mutations?.[collectionName as keyof typeof fixtureContext.mutations];

    const createMutation = useMutation({
        mutationFn: async (data: MutationPayload) => {
            if (fixtureContext) {
                if (fixtureMutations?.create) {
                    return fixtureMutations.create(data);
                }
                return data;
            }
            if (!workspaceId) throw new Error('No workspace selected');

            return await addDoc(
                collection(db, collectionName).withConverter(getConverter<WorkspaceEntity>(collectionName)),
                {
                    ...data,
                    workspaceId,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [collectionName, workspaceId] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: MutationPayload }) => {
            if (fixtureContext) {
                if (fixtureMutations?.update) {
                    return fixtureMutations.update({ id, data });
                }
                return { id, data };
            }
            const ref = doc(db, collectionName, id).withConverter(getConverter<WorkspaceEntity>(collectionName));
            await setDoc(ref, {
                ...data,
                updatedAt: serverTimestamp(),
            }, { merge: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [collectionName, workspaceId] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            if (fixtureContext) {
                if (fixtureMutations?.remove) {
                    return fixtureMutations.remove(id);
                }
                return id;
            }
            await deleteDoc(doc(db, collectionName, id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [collectionName, workspaceId] });
        },
    });

    return { createMutation, updateMutation, deleteMutation };
}
