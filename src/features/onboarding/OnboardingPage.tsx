import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, setDoc, updateDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function OnboardingPage() {
    const [workspaceName, setWorkspaceName] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, refreshAppUser } = useAuth();
    const navigate = useNavigate();

    const handleCreateWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            // 1. Create workspace
            const workspaceRef = await addDoc(collection(db, 'workspaces'), {
                name: workspaceName,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // 2. Create workspace member (owner)
            await setDoc(doc(db, 'workspaceMembers', `${workspaceRef.id}_${user.uid}`), {
                workspaceId: workspaceRef.id,
                userId: user.uid,
                role: 'owner',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // 3. Update user's default workspace
            await updateDoc(doc(db, 'users', user.uid), {
                defaultWorkspaceId: workspaceRef.id,
                updatedAt: serverTimestamp(),
            });

            toast.success('Workspace creado exitosamente');
            await refreshAppUser();
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            toast.error('Error al crear el workspace: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-slate-200">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center font-bold text-slate-900">Bienvenido a Flowbit</CardTitle>
                    <CardDescription className="text-center text-slate-500">
                        Primero, vamos a crear tu espacio de trabajo (Workspace)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateWorkspace} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700" htmlFor="workspaceName">Nombre de la empresa o equipo</label>
                            <Input
                                id="workspaceName"
                                placeholder="Ej. Mi Agencia Creativa"
                                value={workspaceName}
                                onChange={(e) => setWorkspaceName(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full h-11 text-base bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                            {loading ? 'Preparando todo...' : 'Empezar ahora'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-slate-400">
                        Posteriormente podrás invitar a otros miembros a tu workspace.
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
