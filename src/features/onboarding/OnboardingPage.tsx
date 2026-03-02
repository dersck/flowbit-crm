import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/AuthContext';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Error inesperado';
}

export default function OnboardingPage() {
    const [workspaceName, setWorkspaceName] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, refreshAppUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Crear workspace | Flowbit CRM';
    }, []);

    const handleCreateWorkspace = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user) return;

        setLoading(true);

        try {
            const workspaceRef = await addDoc(collection(db, 'workspaces'), {
                name: workspaceName,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            await setDoc(doc(db, 'workspaceMembers', `${workspaceRef.id}_${user.uid}`), {
                workspaceId: workspaceRef.id,
                userId: user.uid,
                role: 'owner',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            await updateDoc(doc(db, 'users', user.uid), {
                defaultWorkspaceId: workspaceRef.id,
                updatedAt: serverTimestamp(),
            });

            toast.success('Workspace creado exitosamente');
            await refreshAppUser();
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error(`Error al crear el workspace: ${getErrorMessage(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 p-4">
            <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center">
                <Card className="w-full max-w-md border-slate-200 shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle as="h1" className="text-center text-2xl font-bold text-slate-900">
                            Bienvenido a Flowbit
                        </CardTitle>
                        <CardDescription className="text-center text-slate-500">
                            Primero, vamos a crear tu espacio de trabajo (Workspace)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateWorkspace} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700" htmlFor="workspaceName">
                                    Nombre de la empresa o equipo
                                </label>
                                <Input
                                    id="workspaceName"
                                    placeholder="Ej. Mi Agencia Creativa"
                                    value={workspaceName}
                                    onChange={(event) => setWorkspaceName(event.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="h-11 w-full text-base bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                                {loading ? 'Preparando todo...' : 'Empezar ahora'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-center text-sm text-slate-400">
                            Posteriormente podras invitar a otros miembros a tu workspace.
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}
