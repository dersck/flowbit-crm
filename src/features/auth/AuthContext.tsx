import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User as AppUser } from '@/types';

type FirestoreDateValue = {
    toDate: () => Date;
} | Date | null | undefined;

const toDate = (val: FirestoreDateValue) => {
    if (!val) return null;
    if (typeof val === 'object' && 'toDate' in val && typeof val.toDate === 'function') return val.toDate();
    if (val instanceof Date) return val;
    return null;
};

export interface AuthContextType {
    user: FirebaseUser | null;
    appUser: AppUser | null;
    loading: boolean;
    refreshAppUser: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({
    user: null,
    appUser: null,
    loading: true,
    refreshAppUser: async () => { },
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAppUser = async (uid: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setAppUser({
                    id: userDoc.id,
                    ...data,
                    createdAt: toDate(data.createdAt),
                    updatedAt: toDate(data.updatedAt),
                } as AppUser);
            } else {
                setAppUser(null);
            }
        } catch (error) {
            console.error('Error fetching app user:', error);
            setAppUser(null);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                await fetchAppUser(firebaseUser.uid);
            } else {
                setAppUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const refreshAppUser = async () => {
        if (user) {
            await fetchAppUser(user.uid);
        }
    };

    return (
        <AuthContext.Provider value={{ user, appUser, loading, refreshAppUser }}>
            {children}
        </AuthContext.Provider>
    );
};
