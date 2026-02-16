import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    orderBy,
    limit,
    Timestamp,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { converters } from '@/lib/converters';
import { useAuth } from '@/features/auth/AuthContext';

export function useWorkspaceQuery<T extends { id: string }>(
    collectionName: keyof typeof converters,
    queryName: string,
    extraWheres: any[] = []
) {
    const { appUser } = useAuth();
    const workspaceId = appUser?.defaultWorkspaceId;

    return useQuery({
        queryKey: [collectionName, workspaceId, queryName, extraWheres],
        queryFn: async () => {
            if (!workspaceId) return [];

            const q = query(
                collection(db, collectionName).withConverter((converters as any)[collectionName]),
                where('workspaceId', '==', workspaceId),
                ...extraWheres
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => doc.data() as T);
        },
        enabled: !!workspaceId,
    });
}

export function useWorkspaceMutation<T extends { id: string }>(
    collectionName: keyof typeof converters
) {
    const queryClient = useQueryClient();
    const { appUser } = useAuth();
    const workspaceId = appUser?.defaultWorkspaceId;

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            if (!workspaceId) throw new Error('No workspace selected');

            return await addDoc(
                collection(db, collectionName).withConverter((converters as any)[collectionName]),
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
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const ref = doc(db, collectionName, id);
            await updateDoc(ref, {
                ...data,
                updatedAt: serverTimestamp(),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [collectionName, workspaceId] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await deleteDoc(doc(db, collectionName, id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [collectionName, workspaceId] });
        },
    });

    return { createMutation, updateMutation, deleteMutation };
}
